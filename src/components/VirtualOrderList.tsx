"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import {OrderCard} from "@/components/OrderCard";

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

type Props = {
    orders: Order[];
    onSelect: (id: string) => void;
    disabled: boolean;
};

export default function VirtualOrderList({
                                     orders,
                                     onSelect,
                                     disabled,
                                 }: Props) {
    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: orders.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 220,
        overscan: 5,
    });

    return (
        <div
            ref={parentRef}
            className="h-[60vh] overflow-auto"
        >
            <div
                style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                }}
            >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                    const item = orders[virtualRow.index];

                    return (
                        <div
                            key={item.id}
                            data-index={virtualRow.index}
                            ref={virtualizer.measureElement}
                            className="absolute top-0 left-0 w-full p-2"
                            style={{
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                        >
                            <OrderCard
                                item={item}
                                onSelect={onSelect}
                                disabled={disabled}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}