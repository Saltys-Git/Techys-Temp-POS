"use client";

import { memo } from "react";
import { Card, CardBody } from "@nextui-org/react";

type OrderItem = {
    name: string;
    total: number;
};

type Order = {
    id: string;
    invoiceNo: string;
    createdAt: Date;
    total: number;
    customerName: string;
    issue: string;
    preparedBy: string;
    paid: number;
    items: OrderItem[];
};

type OrderCardProps = {
    item: Order;
    onSelect: (id: string) => void;
    disabled: boolean;
};

export const OrderCard = memo(function OrderCard({
                                                     item,
                                                     onSelect,
                                                     disabled,
                                                 }: OrderCardProps) {
    return (
        <Card
            isPressable={!disabled}
            isHoverable
            onPress={() => onSelect(item.id)}
            className="min-h-[190px] w-full"
        >
            <CardBody className="grid grid-cols-2 gap-1">
                <p>Invoice No: {item.invoiceNo}</p>
                <p>Prepared By: {item.preparedBy}</p>
                <p>Customer Name: {item.customerName}</p>
                <p>Issue: {item.issue}</p>
                <p>Total Amount: £{item.total}</p>
                <p>Paid Amount: £{item.paid}</p>

                <p className="col-span-2">
                    Created On: {item.createdAt.toUTCString()}
                </p>

                <p className="col-span-2">Items:</p>

                <ul className="col-span-2 list-decimal list-inside">
                    {item.items.map((product) => (
                        <li key={`${item.id}-${product.name}`}>
                            {product.name} - £{product.total}
                        </li>
                    ))}
                </ul>
            </CardBody>
        </Card>
    );
});