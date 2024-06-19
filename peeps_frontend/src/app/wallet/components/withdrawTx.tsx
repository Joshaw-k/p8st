"use client";

import React, { useEffect, useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ethers } from "ethers";
import { defaultDappAddress, erc20Address } from "../../utils/constants";
import { useRollups } from "../../useRollups";
import { usePeepsContext } from "../../context";
import { ButtonLoader } from "../../components/Button";
import { LucideArrowUpRight, LucideX } from "lucide-react";
import { useActiveAccount } from "thirdweb/react";
import toast from "react-hot-toast";

export const WithDrawTransaction = () => {
    const { baseDappAddress, fetchBalance } = usePeepsContext();
    const rollups = useRollups(baseDappAddress);
    const [dp, setDp] = useState<string>("");
    const [walletAmount, setWithdrawAmount] = useState<number>(0);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const activeAccount = useActiveAccount();

    const handleWithdrawToken = async (e: any) => {
        e.preventDefault()
        setIsSubmit(true);
        console.log(walletAmount)
        try {
            if (rollups && activeAccount) {
                let erc20_amount = ethers.utils.parseEther(String(walletAmount)).toString();
                console.log("erc20 after parsing: ", erc20_amount);
                const input_obj = {
                    method: "erc20_withdraw",
                    args: {
                        erc20: erc20Address,
                        amount: erc20_amount,
                    },
                };
                const data = JSON.stringify(input_obj);
                let payload = ethers.utils.toUtf8Bytes(data);
                await rollups.inputContract.addInput(baseDappAddress, payload);
                setIsModalOpen(false);
                toast.success("Withdrawal successful");
                fetchBalance();
            }
        } catch (e) {
            console.log(e);
            setIsModalOpen(false);
            toast.error("Withdrawal failed");
        }

        // console.log("clicked")
        // "Unload" the submit button
        setIsSubmit(false);
    };


    return (
        <AlertDialog.Root open={isModalOpen}>
            <AlertDialog.Trigger asChild>
                <button
                    type="button"
                    className="btn bg-white text-walletDark hover:text-white btn-lg rounded-box inline-flex w-auto items-center justify-center font-medium text-base leading-none outline-none outline-0"
                    onClick={() => setIsModalOpen(true)}
                >
                    Withdraw <LucideArrowUpRight className="hidden lg:inline-block" />
                </button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="bg-black/40 bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0 dark:bg-base-300/80 dark:backdrop-blur-sm z-30" />
                <AlertDialog.Content className="z-40 data-[state=open]:animate-contentShow fixed bottom-4 left-[50%] max-h-[85vh] w-[96vw] lg:w-[90vw] max-w-[540px] bg-base-100 translate-x-[-50%] lg:translate-y-[-50%] rounded-lg py-1 lg:p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none dark:bg-base-100">
                    <AlertDialog.Title className="text-mauve12 mt-12 mb-4 lg:mt-4 lg:mb-8 text-xl text-center font-bold">
                        Withdraw Token
                    </AlertDialog.Title>
                    <AlertDialog.Description className="text-[15px] text-center leading-normal">
                        {/* We require this to serve the best experience */}
                        <div className="card items-center shrink-0 lg:my-4 w-full bg-base-100">
                            <form className="card-body w-full" onSubmit={handleWithdrawToken}>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Amount to withdraw</span>
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Amount"
                                        className="input input-bordered"
                                        onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                                        required
                                    />
                                </div>
                                <div className="form-control mt-6">
                                    <button
                                        type="submit"
                                        className="btn btn-primary dark:bg-[#4563eb] dark:border-0 rounded-xl"
                                    >
                                        {isSubmit ? <ButtonLoader /> : "Withdraw"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </AlertDialog.Description>
                    <div className="absolute top-8 right-4 flex justify-end gap-[25px]">
                        <AlertDialog.Cancel asChild>
                            <button
                                title="Close Send token dialog"
                                type="button"
                                className="btn size-12 rounded-full text-xl"
                                aria-label="Close"
                                onClick={() => setIsModalOpen(false)}
                            >
                                {/* <Cross2Icon size={64} /> */}
                                <LucideX strokeWidth={4} />
                            </button>
                        </AlertDialog.Cancel>
                        {/* <AlertDialog.Action asChild>
            <button className="text-red11 bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
              Yes, delete account
            </button>
          </AlertDialog.Action> */}
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
};