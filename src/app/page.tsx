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
import {CircleX, NotebookTabs, Plus} from "lucide-react";
import {Card, CardBody} from "@nextui-org/card";
import {AddToDB, getInvoiceNo} from "@/lib/firebaseActions";
import BarcodeScanner from "@/components/BarcodeScanner";
import {Modal, ModalBody, ModalContent, ModalHeader} from "@nextui-org/modal";
import PrintReceipt from "@/lib/printHandler";


export default function Home() {
    const resetButtonRef = useRef<HTMLButtonElement>(null)
    const [isLoading, setIsLoading] = useState(false)

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
        console.log("Items",items)
        console.log("FormData",formData)
    }, [items, formData]);
    
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
            PrintReceipt(formData,items).then(()=>{
                Swal.fire({
                    title: 'Success!',
                    text: 'Order added to the database.',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    setIsLoading(false)
                    if(resetButtonRef.current !== null) {
                        resetButtonRef.current.click()
                    }
                })
            })
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
                            value={formData.discount?.toString()}
                            onValueChange={e => {
                                setFormData((prev) => {
                                    prev.discount = e
                                    return {...prev}
                                })
                            }}
                        />
                        <Input
                            label="Paid"
                            size={"sm"}
                            value={formData.paid?.toString()}
                            onValueChange={e => {
                                setFormData((prev) => {
                                    prev.paid = e
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
                            onPress={(event) => {
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

                    return(
                        <>
                            <ModalHeader className="flex flex-col gap-1">Orders List</ModalHeader>
                            <ModalBody>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    Nullam pulvinar risus non risus hendrerit venenatis.
                                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
                                </p>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    Nullam pulvinar risus non risus hendrerit venenatis.
                                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
                                </p>
                                <p>
                                    Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
                                    dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis.
                                    Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod.
                                    Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur
                                    proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                                </p>
                            </ModalBody>
                        </>
                        )
                    }}
                </ModalContent>
            </Modal>
        </div>
    );
}
