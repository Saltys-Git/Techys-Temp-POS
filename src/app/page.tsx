"use client"
import Image from "next/image";
import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import Swal from 'sweetalert2'
import {Button as NextUIButton, Input, useDisclosure} from "@nextui-org/react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {useEffect, useRef, useState} from "react";
import {CircleX, NotebookTabs, Plus, RefreshCcw} from "lucide-react";
import {Card, CardBody} from "@nextui-org/card";
import {AddToDB, getInvoiceNo, getOrderDataById, getOrdersData} from "@/lib/firebaseActions";
import BarcodeScanner from "@/components/BarcodeScanner";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import PrintReceipt from "@/lib/printHandler";
import {Spinner} from "@nextui-org/spinner";
import {Timestamp} from "@firebase/firestore";


export default function Home() {
    const resetButtonRef = useRef<HTMLButtonElement>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isModalLoading, setIsModalLoading] = useState(false)
    const [isOrderLoading, setIsOrderLoading] = useState(false)
    const [formData, setFormData] = useState<{
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
    }>({
        invoiceNo: "",
        createdAt: undefined,
        preparedBy: "",
        paidBy: "",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        issue: "",
        discount: 0,
        subTotal: 0,
        vat: 0,
        total: 0,
        paid: 0,
        change: 0,
        balance: 0,
    })
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
    const [items, setItems] = useState<{
        name: string;
        description: string;
        quantity: number;
        total: number;
        price: number;
    }[]>([{
        name: "",
        description: "",
        quantity: 1,
        total: 0,
        price: 0,
    }])
    const {isOpen, onOpen, onClose} = useDisclosure();

    useEffect(() => {
        let subTotal = 0
        items.forEach(item => {
            subTotal += item.total
        })
        setFormData((prev) => {
            prev.subTotal = subTotal
            return {...prev}
        })
    }, [items]);

    useEffect(() => {
        setFormData((prev) => {
            prev.total = (prev.subTotal ?? 0) + (((prev.subTotal ?? 0) / 100) * 20) - (Number(prev.discount) ?? 0)
            prev.vat = (((prev.subTotal ?? 0) / 100) * 20)
            return {...prev}
        })
    }, [formData.subTotal, formData.discount]);

    useEffect(() => {
        setFormData((prev) => {
            if (Number(prev.paid) >= (prev.total ?? 0)) {
                prev.change = Number(prev.paid) - Number(prev.total ?? 0)
            } else {
                prev.change = 0
            }
            if (Number(prev.paid) <= (prev.total ?? 0)) {
                prev.balance = Number(prev.total ?? 0) - Number(prev.paid)
            } else {
                prev.balance = 0
            }
            return {...prev}
        })
    }, [formData.total, formData.discount, formData.paid]);

    useEffect(() => {
        getInvoiceNo().then(res => {
            setFormData((prev) => {
                prev.invoiceNo = res.toString()
                return {...prev}
            })
        })
        getOrders()
    }, []);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (items.length === 1 && (items[0].name === "" || formData.total === 0)) {
            Swal.fire({
                title: 'Error!',
                text: 'Your cart is empty! Please add item name and price to continue',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        }
        setIsLoading(true)
        AddToDB(formData, items).then((res) => {
            if (!res) return Swal.fire({
                title: 'Error!',
                text: 'Something went wrong! Please try again.',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
            PrintReceipt(formData, items).then(() => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Order added to the database.',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setIsLoading(false)
                    setTimeout(() => {
                        if (resetButtonRef.current !== null) {
                            resetButtonRef.current.click()
                        }
                    }, 500)
                })
            })
        })
    }

    function getOrders() {
        setIsModalLoading(true)
        getOrdersData().then(res => {
            setIsModalLoading(false)
            if (res.result && res.data) {
                setModalData(res.data)
            }
        })
    }


    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-2">
            <BarcodeScanner setFormData={setFormData} setItems={setItems}/>
            <div className="flex flex-row my-1 space-x-2 justify-between items-center w-full px-4">
                <div className="flex flex-row space-x-2 justify-center items-center self-center select-none">
                    <Image src="/logo.png" height={50} width={50} alt="techy's logo" className="mt-4"/>
                    <p className="text-3xl font-bold mt-3">Techy&apos;s POS</p>
                </div>
                <div className="flex flex-row space-x-2 justify-center items-center">
                    <NextUIButton onPress={() => onOpen()} isIconOnly variant="light" aria-label="Open List">
                        <NotebookTabs/>
                    </NextUIButton>
                </div>
            </div>
            <section className="grid grid-cols-2 items-center justify-center h-full w-full gap-2">
                <div
                    className="flex flex-col h-full w-full items-center justify-start border-2 border-gray-200 rounded-md">
                    <div className="flex flex-col items-center bg-orange-100 w-full h-fit rounded-t-sm">
                        <Label className="my-1 text-lg font-bold">Information Center</Label>
                        <Separator/>
                    </div>
                    <div className="grid grid-cols-3 gap-2 w-full p-2">
                        <Label>Invoice No.</Label>
                        <Label>:</Label>
                        <Label className="justify-self-end">{formData.invoiceNo ?? "Loading..."}</Label>
                        {formData.createdAt && (
                            <>
                                <Label>Previously Created On</Label>
                                <Label>:</Label>
                                <Label
                                    className="justify-self-end">{formData.createdAt.toLocaleDateString()}</Label>
                            </>
                        )}
                        <Label>Sub Total</Label>
                        <Label>:</Label>
                        <Label
                            className="justify-self-end">£{formData.subTotal ? formData.subTotal.toFixed(2) : (0).toFixed(2)}</Label>
                        <Label>Discount</Label>
                        <Label>:</Label>
                        <Label
                            className="justify-self-end">£{formData.discount ? Number(formData.discount).toFixed(2) : (0).toFixed(2)}</Label>
                        <Label>VAT</Label>
                        <Label>:</Label>
                        <Label
                            className="justify-self-end">£{formData.vat ? formData.vat.toFixed(2) : (0).toFixed(2)}</Label>
                        <Label>Total</Label>
                        <Label>:</Label>
                        <Label
                            className="justify-self-end">£{formData.total ? formData.total.toFixed(2) : (0).toFixed(2)}</Label>
                        <Label>Paid</Label>
                        <Label>:</Label>
                        <Label
                            className="justify-self-end">£{formData.paid ? Number(formData.paid).toFixed(2) : (0).toFixed(2)}</Label>
                        <Label>Change</Label>
                        <Label>:</Label>
                        <Label
                            className="justify-self-end">£{formData.change ? formData.change.toFixed(2) : (0).toFixed(2)}</Label>
                        <Label>Balance</Label>
                        <Label>:</Label>
                        <Label
                            className="justify-self-end">£{formData.balance ? formData.balance.toFixed(2) : (0).toFixed(2)}</Label>
                    </div>
                    <form
                        className="grid grid-cols-2 gap-2 w-full p-2"
                        onSubmit={e => handleSubmit(e)}
                    >
                        <Input
                            isRequired
                            required
                            type="text"
                            size={"sm"}
                            label="Customer Name"
                            value={formData.customerName}
                            onChange={e => {
                                setFormData((prev) => {
                                    prev.customerName = e.target.value
                                    return {...prev}
                                })
                            }}
                        />
                        <Input
                            type="email"
                            label="Customer Email"
                            size={"sm"}
                            value={formData.customerEmail}
                            onChange={e => {
                                setFormData((prev) => {
                                    prev.customerEmail = e.target.value
                                    return {...prev}
                                })
                            }}
                        />
                        <Input
                            type="tel"
                            label="Customer Phone"
                            size={"sm"}
                            value={formData.customerPhone}
                            onChange={e => {
                                setFormData((prev) => {
                                    prev.customerPhone = e.target.value
                                    return {...prev}
                                })
                            }}
                        />
                        <Input
                            type="text"
                            isRequired
                            required
                            label="Issue"
                            size={"sm"}
                            value={formData.issue}
                            onChange={e => {
                                setFormData((prev) => {
                                    prev.issue = e.target.value
                                    return {...prev}
                                })
                            }}
                        />
                        <Select
                            required
                            value={formData.preparedBy}
                            onValueChange={e => {
                                setFormData((prev) => {
                                    prev.preparedBy = e
                                    return {...prev}
                                })
                            }}
                        >
                            <SelectTrigger className="w-full col-span-2 h-full">
                                <SelectValue placeholder="Prepared By"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Prepared By</SelectLabel>
                                    <SelectItem value="Arif">Arif</SelectItem>
                                    <SelectItem value="Xender">Xender</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Input
                            label="Discount"
                            size={"sm"}
                            type="number"
                            required
                            radius="sm"
                            inputMode="numeric"
                            min={0}
                            pattern="[0-9]*"
                            value={formData.discount?formData.discount.toString() : "0"}
                            onValueChange={e => {
                                setFormData((prev) => {
                                    prev.discount = Number(e)
                                    return {...prev}
                                })
                            }}
                        />
                        <Input
                            label="Paid"
                            size={"sm"}
                            type="number"
                            required
                            radius="sm"
                            inputMode="numeric"
                            min={0}
                            pattern="[0-9]*"
                            value={formData.paid?formData.paid.toString():"0"}
                            onValueChange={e => {
                                setFormData((prev) => {
                                    prev.paid = Number(e)
                                    return {...prev}
                                })
                            }}
                        />
                        <Select
                            value={formData.paidBy}
                            onValueChange={e => {
                                setFormData((prev) => {
                                    prev.paidBy = e
                                    return {...prev}
                                })
                            }}
                        >
                            <SelectTrigger className="w-full col-span-2">
                                <SelectValue placeholder="Paid By"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Paid By</SelectLabel>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="Card">Card</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <NextUIButton
                            ref={resetButtonRef}
                            disabled={isLoading}
                            isLoading={isLoading}
                            variant="shadow"
                            type="reset"
                            color="danger"
                            onPress={() => {
                                setFormData({
                                    invoiceNo: "",
                                    createdAt: undefined,
                                    preparedBy: "",
                                    paidBy: "",
                                    customerName: "",
                                    customerEmail: "",
                                    customerPhone: "",
                                    issue: "",
                                    discount: 0,
                                    subTotal: 0,
                                    vat: 0,
                                    total: 0,
                                    paid: 0,
                                    change: 0,
                                    balance: 0,
                                })
                                setItems([{
                                    name: "",
                                    description: "",
                                    quantity: 1,
                                    total: 0,
                                    price: 0,
                                }])
                                getInvoiceNo().then(res => {
                                    setFormData((prev) => {
                                        prev.invoiceNo = res.toString()
                                        return {...prev}
                                    })
                                })
                            }}
                            className="w-full font-bold"
                        >Reset</NextUIButton>
                        <NextUIButton
                            type={"submit"}
                            isLoading={isLoading}
                            disabled={isLoading}
                            variant="shadow"
                            className="w-full bg-[#f37d2d] text-white font-bold shadow-lg shadow-warning/40"
                        >Save & Print</NextUIButton>
                    </form>
                </div>
                <div
                    className="flex flex-col h-full w-full items-center justify-start border-2 border-gray-200 rounded-md">
                    <div className="flex flex-col items-center bg-orange-100 w-full h-fit rounded-t-sm">
                        <Label className="my-1 text-lg font-bold">Cart</Label>
                        <Separator/>
                    </div>
                    <div className="w-full flex flex-col space-y-2 items-center p-2 max-h-[80vh] overflow-y-auto">
                        {items.map((item, index) => {
                            return (
                                <Card key={index} className="w-full min-h-[72px]">
                                    <CardBody className="grid grid-cols-7 space-x-1">
                                        <Input
                                            type="text"
                                            label="Name"
                                            size={"sm"}
                                            className="col-span-2"
                                            value={item.name}
                                            onValueChange={e => {
                                                setItems((prev) => {
                                                    prev[index].name = e
                                                    return [...prev]
                                                })
                                            }}
                                        />
                                        <Input
                                            type="text"
                                            label="Description"
                                            size={"sm"}
                                            className="col-span-2"
                                            value={item.description}
                                            onValueChange={e => {
                                                setItems((prev) => {
                                                    prev[index].description = e
                                                    return [...prev]
                                                })
                                            }}
                                        />
                                        <Input
                                            type="number"
                                            min={0}
                                            label="Price"
                                            size={"sm"}
                                            required
                                            radius="sm"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={String(item.price)}
                                            onValueChange={e => {
                                                setItems((prev) => {
                                                    prev[index].price = Number(e)
                                                    prev[index].total = Number(e) * prev[index].quantity
                                                    return [...prev]
                                                })
                                            }}
                                        />
                                        <Input
                                            type="number"
                                            min={1}
                                            label="Quantity"
                                            size={"sm"}
                                            required
                                            radius="sm"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={String(item.quantity)}
                                            onValueChange={e => {
                                                setItems((prev) => {
                                                    prev[index].quantity = Number(e)
                                                    prev[index].total = Number(e) * prev[index].price
                                                    return [...prev]
                                                })
                                            }}
                                        />
                                        <div className="flex flex-col items-center">
                                            <p>Total</p>
                                            <p>£{items[index].total.toFixed(2)}</p>
                                        </div>
                                    </CardBody>
                                    {items.length > 1 && (
                                        <NextUIButton onPress={() => {
                                            setItems(prev => {
                                                if (prev.length > 1) {
                                                    prev.splice(index, 1)
                                                }
                                                return [...prev]
                                            })
                                        }} className="absolute -right-2 -top-2 min-h-10" isIconOnly variant="light"
                                                      aria-label="Add Item">
                                            <CircleX/>
                                        </NextUIButton>
                                    )}
                                </Card>
                            )
                        })}
                        <NextUIButton onPress={() => {
                            setItems(prev => {
                                prev.push({
                                    name: "",
                                    description: "",
                                    quantity: 1,
                                    total: 0,
                                    price: 0,
                                })
                                return [...prev]
                            })
                        }} className="mb-48 min-h-10" isIconOnly variant="light" aria-label="Add Item">
                            <Plus/>
                        </NextUIButton>
                    </div>
                </div>
            </section>
            <Modal
                scrollBehavior="inside"
                backdrop={"blur"}
                isOpen={isOpen}
                onClose={onClose}
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
                                    {isModalLoading ? (
                                            <Spinner label="Loading..." color="success" labelColor="success"/>
                                        )
                                        : (
                                            <>
                                                {modalData.length > 0 ? (
                                                        <>
                                                            {modalData.map((item, index) => {
                                                                return (
                                                                    <Card isPressable={!isOrderLoading} isHoverable key={index} onPress={() => {
                                                                        setIsOrderLoading(true)
                                                                        getOrderDataById(item.id).then(res => {
                                                                            setIsOrderLoading(false)
                                                                            if (res.result && res.data) {
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
                                                                                    text: 'Order place to the POS.',
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
        </div>
    );
}
