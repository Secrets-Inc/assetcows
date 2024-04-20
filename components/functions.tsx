// imports
import { useContext } from 'react';
import TronWeb from 'tronweb';
import { useAdapters } from '../utils/AdaptersContext';
// import { getUserReferral } from './endpoints';

// Define types for callbacks
interface FunctionCallbacks {
    onStart: () => void;
    onSuccess: () => void;
    onError: (error: any) => void; // Consider defining a more specific error type based on your error handling strategy
}

export const useTronActions = () => {
    const { adapters, selectedIndex } = useAdapters();

    const tronWeb = new TronWeb({
        fullHost: 'https://api.trongrid.io',
        headers: { 'TRON-PRO-API-KEY': process.env.NEXT_PUBLIC_TRONGRID_API_KEY as string },
    });

    const contractAddress: string = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
    const defAdminAddress: string = process.env.NEXT_PUBLIC_DEFADMIN_ADDRESS ?? '';
    const usdtContractAddress: string = process.env.NEXT_PUBLIC_USDT_ADDRESS as string;

    // Convert TRX to SUN
    const trxToSun = (trxAmount: number): number => trxAmount * 1000000;

    const depositUSDT = async (amount: number, referrerAddress: string, userAddress: string) => {
        try {
            const functionSelector = 'deposit(uint256,address)';
            const params = [
                { type: 'uint256', value: amount * 1000000 },
                { type: 'address', value: referrerAddress }
            ];
            const options = {
                feeLimit: 100000000,
                callValue: 0,
                shouldPollResponse: true
            };

            const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
                contractAddress,
                functionSelector,
                options,
                params,
                userAddress
            );

            const signedTransaction = await tronWeb.trx.sign(transaction.transaction);
            const receipt = await tronWeb.trx.sendRawTransaction(signedTransaction);
            return receipt;
        } catch (error) {
            throw error;
        }
    };

    const approveUSDT = async (amount: number, userAddress: string) => {
        try {
            const functionSelector = 'approve(address,uint256)';
            const params = [
                { type: 'address', value: contractAddress },
                { type: 'uint256', value: amount * 1000000 }
            ];
            const options = {
                feeLimit: 100000000,
                callValue: 0,
                shouldPollResponse: true
            };

            const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
                usdtContractAddress,
                functionSelector,
                options,
                params,
                userAddress
            );

            const signedTransaction = await tronWeb.trx.sign(transaction.transaction);
            const receipt = await tronWeb.trx.sendRawTransaction(signedTransaction);
            return receipt;
        } catch (error) {
            throw error;
        }
    };

    const deposit = async (amount: number, { onStart, onSuccess, onError }: FunctionCallbacks) => {
        try {
            onStart();
            if (amount <= 0) {
                onError("Invalid amount");
                return;
            }
            const userAddress = adapters[selectedIndex].address;
            // const referrerAddress = await getUserReferral(userAddress);
            // await approveUSDT(amount, userAddress);
            // await depositUSDT(amount, referrerAddress, userAddress);
            onSuccess();
        } catch (error) {
            onError(error);
        }
    };

    const withdraw = async (amount: number, { onStart, onSuccess, onError }: FunctionCallbacks) => {
        try {
            onStart();
            if (amount <= 0) {
                onError("Invalid amount");
                return;
            }
             // Prepare the parameters for the withdraw function
            const functionSelector = 'withdraw(uint256,bool,bool)';
            const withdrawValue = trxToSun(amount); // Convert the transaction amount
            const params = [
                { type: 'uint256', value: withdrawValue },
                { type: 'bool', value: false },
                { type: 'bool', value: false }
            ];
            const options = {
                feeLimit: 100000000,
                callValue: 0,
                shouldPollResponse: true
            };

            // Trigger the smart contract function
            const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
                contractAddress,  // Replace with your contract address
                functionSelector,
                options,
                params,
                adapters[selectedIndex].address  // User's address
            );

            // Sign the transaction with WalletConnect
            const signedTransaction = await adapters[selectedIndex].signTransaction(transaction.transaction);

            // Broadcast the transaction
            const receipt = await tronWeb.trx.sendRawTransaction(signedTransaction);
            onSuccess();
        } catch (error) {
            onError(error);
        }
    };

    return { deposit, withdraw };
};
