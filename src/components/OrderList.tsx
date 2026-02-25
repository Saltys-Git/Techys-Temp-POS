import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Button as NextUIButton, useDisclosure, Card, CardBody, Spinner, Input} from "@nextui-org/react";
import { Separator } from "./ui/separator";
import { useEffect, useState } from "react";
import { NotebookTabs, RefreshCcw, Search } from 'lucide-react';
import Swal from "sweetalert2";
import { getOrderDataById, getOrdersData } from "@/lib/firebaseActions";
import {Timestamp} from "@firebase/firestore";

type FormData = {
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
};
type ItemData = {
    name: string;
    description: string;
    quantity: number;
    total: number;
    price: number;
}[]
type ChildProps = {
  updateForm: (data: FormData) => void,
  updateItem: (data: ItemData) => void,
};

export default function OrderList({ updateForm, updateItem }: ChildProps){
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [isModalLoading, setIsModalLoading] = useState(false)
    const [isOrderLoading, setIsOrderLoading] = useState(false)
    const [input, setInput] = useState<string>("")
    const [modalData, setModalData] = useState<{
        id: string,
        invoiceNo: string,
        createdAt: Date,
        total: number,
        customerName: string,
        issue: string,
        preparedBy: string,
        paid: number
    }[]>([])

    function getOrders() {
        setIsModalLoading(true)
        getOrdersData().then(res => {
            setIsModalLoading(false)
            if (res.result && res.data) {
                setModalData(res.data)
            }
        })
    }


    function onCloseWorks(){
        setInput('')
        onClose()
    }

    useEffect(()=>{
        if(!isOpen) return
        getOrders()
    },[isOpen])

    return(
        <>
            <div className="flex flex-row space-x-2 justify-center items-center">
                    <NextUIButton onPress={() => onOpen()} isIconOnly variant="light" aria-label="Open List">
                        <NotebookTabs/>
                    </NextUIButton>
                </div>
            <Modal
                scrollBehavior="inside"
                backdrop={"blur"}
                isOpen={isOpen}
                onClose={onCloseWorks}
                shadow={"md"}
                size={"xl"}
                motionProps={{
                    variants: {
                        enter: {
                            y: 0,
                            opacity: 1,
                            transition: {
                                duration: 0.3,
                                ease: "easeOut",
                            },
                        },
                        exit: {
                            y: -20,
                            opacity: 0,
                            transition: {
                                duration: 0.2,
                                ease: "easeIn",
                            },
                        },
                    }
                }}
            >
                <ModalContent>
                    {() => {
                        return (
                            <>
                                <ModalHeader className="flex flex-row py-1 gap-1 items-center">
                                    <span>Orders List</span>
                                    <NextUIButton isLoading={isModalLoading} className={`self-end min-h-10 ${isModalLoading && "hidden"}`}
                                                  onPress={() => getOrders()} isIconOnly variant="light" color="success"
                                                  aria-label="Refresh List">
                                        <RefreshCcw/>
                                    </NextUIButton>
                                </ModalHeader>
                                <Separator/>
                                <ModalBody>
                                    <Input type="text"
                                        label="Enter Order Detail"
                                        size={"sm"}
                                        value={input}
                                        onValueChange={setInput}/>
                                    {isModalLoading ? (
                                            <Spinner label="Loading..." color="success" labelColor="success"/>
                                        )
                                        : (
                                            <>
                                                {modalData.length > 0 ? (
                                                        <>
                                                            {(input !== '' ? modalData.filter((item) => Object.values(item).some((value) => value.toString().toLowerCase().includes(input.toLowerCase()))) :modalData).map((item, index) => {
                                                                return (
                                                                    <Card isPressable={!isOrderLoading} isHoverable key={index} onPress={() => {
                                                                        setIsOrderLoading(true)
                                                                        getOrderDataById(item.id).then(res => {
                                                                            setIsOrderLoading(false)
                                                                            if (res.result && res.data) {
                                                                                updateForm({
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
                                                                                updateItem(res.data.items)
                                                                                Swal.fire({
                                                                                    title: 'Success!',
                                                                                    text: 'Order place to the POS.',
                                                                                    icon: 'success',
                                                                                    confirmButtonText: 'Ok'
                                                                                })
                                                                                onCloseWorks()
                                                                            }else{
                                                                                Swal.fire({
                                                                                    title: 'Error!',
                                                                                    text: res.error === "Not Found" ? "Order not found in the database." : "Something went wrong. Please try again.",
                                                                                    icon: 'error',
                                                                                    confirmButtonText: 'Ok'
                                                                                })
                                                                            }
                                                                        })
                                                                    }} className="min-h-[140px]">
                                                                        <CardBody className="grid grid-cols-2 gap-1">
                                                                            <p>Invoice No: {item.invoiceNo}</p>
                                                                            <p>Prepared By: {item.preparedBy}</p>
                                                                            <p className="col-span-2">Created On: {item.createdAt.toUTCString()}</p>
                                                                            <p>Customer Name: {item.customerName}</p>
                                                                            <p>Issue: {item.issue}</p>
                                                                            <p>Total Amount: £{item.total.toFixed(2)}</p>
                                                                            <p>Paid Amount: £{item.paid.toFixed(2)}</p>
                                                                        </CardBody>
                                                                    </Card>
                                                                )
                                                            })}
                                                        </>
                                                    )
                                                    :
                                                    (
                                                        <p className="text-xl py-8 w-full text-center">Something went
                                                            wrong. Please
                                                            press refresh.</p>
                                                    )}
                                            </>
                                        )
                                    }
                                </ModalBody>
                                <ModalFooter></ModalFooter>
                            </>
                        )
                    }}
                </ModalContent>
            </Modal>
        </>
    )
}