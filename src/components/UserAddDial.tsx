import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Button as NextUIButton, Input, useDisclosure, Card, CardBody} from "@nextui-org/react";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { Search } from 'lucide-react';
import Swal from "sweetalert2";
import { getCustomerData } from "@/lib/firebaseActions";
import {UserRoundPlus} from "lucide-react";

type CustomerData = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
};

type ChildProps = {
  updateCustomer: (data: CustomerData) => void;
};

export default function UserAddDial({ updateCustomer }: ChildProps){
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [isLoading,setIsLoading] = useState(false)
    const [input, setInput] = useState<string>("")
    const [result, setResult] = useState<{
            invoiceNo: string;
            createdAt: Date;
            customerName: string;
            customerEmail: string;
            customerPhone: string;
        }[]>([])

    function getCustomerList(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (input.length === 1) {
            Swal.fire({
            title: 'Error!',
            text: 'Please enter a valid customer name or phone number',
            icon: 'error',
            confirmButtonText: 'Ok'
            })
            return
        }
        setIsLoading(true)
        getCustomerData(input).then(res => {
            setIsLoading(false)
            if (res.result && res.data) {
                setResult(res.data)
            }
        })   
    }


    function onCloseWorks(){
        setInput('')
        setResult([])
        onClose()
    }
    return(
        <>
            <div
                className="grid justify-items-end w-full p-2">
                    <NextUIButton
                        isLoading={isLoading}
                        onPress={onOpen}
                        isIconOnly
                        className="w-fit"
                    ><UserRoundPlus/></NextUIButton>
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
                        <>
                            <ModalHeader className="flex flex-row py-1 gap-1 items-center">
                                <span>Add Customer</span>
                            </ModalHeader>
                            <Separator/>
                            <ModalBody>
                                <form onSubmit={getCustomerList} className="flex flex-row gap-2 items-center justify-center">
                                    <Input type="text"
                                        label="Customer Name or Phone"
                                        size={"sm"}
                                        value={input}
                                        onValueChange={setInput}/>
                                    <NextUIButton
                                        type="submit"
                                        isIconOnly
                                        className="w-fit"
                                    ><Search /></NextUIButton>
                                </form>
                                
                                <p className="w-full text-xl font-bold underline text-center">Result:</p>
                                <>
                                    {result.length > 0 ? (
                                        <>
                                            {result.map((item, index) => {
                                                return (
                                                    <Card isHoverable isPressable key={index} onPress={() => {
                                                        updateCustomer({
                                                            customerName : item.customerName,
                                                            customerEmail : item.customerEmail,
                                                            customerPhone : item.customerPhone
                                                        })
                                                        onClose()
                                                    }} className="min-h-[140px]">
                                                        <CardBody className="grid grid-cols-2 gap-1">
                                                            <p>From Invoice No: {item.invoiceNo}</p>
                                                            <p className="col-span-2">Created On: {item.createdAt.toUTCString()}</p>
                                                            <p>Customer Name: {item.customerName}</p>
                                                            <p>Customer Email: {item.customerEmail}</p>
                                                            <p>Customer Phone: {item.customerPhone}</p>
                                                        </CardBody>
                                                    </Card>
                                                )
                                            })}
                                        </>
                                    )
                                    :
                                    (
                                        <p className="text-xl py-8 w-full text-center">No Result Found</p>
                                    )}
                                </>
                            </ModalBody>
                            <ModalFooter></ModalFooter>
                        </>
                </ModalContent>
            </Modal>
        </>
    )
}