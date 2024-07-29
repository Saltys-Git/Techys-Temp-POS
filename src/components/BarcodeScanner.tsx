"use client";

import {Dispatch, SetStateAction, useEffect} from "react";
import {getOrderData} from "@/lib/firebaseActions";
import Swal from "sweetalert2";
import {Timestamp} from "@firebase/firestore";


interface BarcodeScannerProps {
    setFormData: Dispatch<SetStateAction<{
        invoiceNo: string;
        createdAt: Date | undefined;
        preparedBy: string;
        paidBy: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        issue: string;
        discount: number | string;
        subTotal: number;
        vat: number;
        total: number;
        paid: number | string;
        change: number;
        balance: number;
    }>>,
    setItems: Dispatch<SetStateAction<{
        name: string;
        description: string;
        quantity: number;
        total: number;
        price: number
    }[]>>
}

export default function BarcodeScanner({setFormData,setItems}: BarcodeScannerProps) {
    let barcodeScan = "";
    const isBrowser = () => typeof window !== "undefined";

    useEffect(() => {
        const handleScan = (data: string) => {
            setTimeout(() => {
                getOrderData(data).then(res=>{
                    if(res.result && res.data){
                        setFormData({
                            invoiceNo: res.data.invoiceNo,
                            createdAt: new Timestamp(res.data.createdAt.seconds,res.data.createdAt.nanoseconds).toDate(),
                            preparedBy: res.data.preparedBy,
                            paidBy: res.data.paidBy,
                            customerName: res.data.customerName,
                            customerEmail: res.data.customerEmail,
                            customerPhone: res.data.customerPhone,
                            issue: res.data.issue,
                            discount: res.data.discount,
                            subTotal: res.data.subTotal,
                            vat: res.data.vat,
                            total: res.data.total,
                            paid: res.data.paid,
                            change: res.data.change,
                            balance: res.data.balance,
                        })
                        res.data.items.map((item: any, index: number) => {
                            if (index === 0) {
                                setItems([item])
                            } else {
                                setItems(prev => {
                                    prev.push(item)
                                    return [...prev]
                                })
                            }
                        })
                        Swal.fire({
                            title: 'Success!',
                            text: 'Order fetched and added to the POS.',
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        })
                    }else{
                        Swal.fire({
                            title: 'Error!',
                            text: res.error === "Not Found" ? "Order not found in the database." : "Something went wrong. Please try again.",
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        })
                    }
                    barcodeScan = "";
                })
            }, 50);
        };

        function handleKeyDown(e: any) {
            if (
                e.key === "Enter" &&
                barcodeScan.length > 2
            ) {
                handleScan(barcodeScan);
                return;
            }
            if (e.key === "Shift") {
                return;
            }

            barcodeScan += e.key;

            setTimeout(() => {
                barcodeScan = "";
            }, 100);
        }

        if (isBrowser()) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return function cleanup() {
            if (isBrowser()) {
                document.removeEventListener("keydown", handleKeyDown);
            }
        };
    });
    return (
        <></>
    );
}
