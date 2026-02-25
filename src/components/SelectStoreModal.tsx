import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Button as NextUIButton, useDisclosure} from "@nextui-org/react";
import { Separator } from "./ui/separator";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";


type ChildProps = {
  updateStore: (store: string) => void;
};

export default function SelectStoreModal({ updateStore }: ChildProps){
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [selectedStore, setSelectedStore] = useState('S1')

    useEffect(()=>{
        onOpen()
    },[])
    
    function handleSelectedStore(){
        updateStore(selectedStore)
        onClose()
    }

    return(
        <Modal
                scrollBehavior="inside"
                backdrop={"blur"}
                isOpen={isOpen}
                isDismissable={false}
                isKeyboardDismissDisabled={false}
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
                    <ModalHeader className="flex flex-row py-1 gap-1 items-center">
                        <span>Select Store</span>
                    </ModalHeader>
                    <Separator/>
                    <ModalBody>
                        <Select
                            value={selectedStore}
                            onValueChange={e => {
                                setSelectedStore(e)
                            }}
                        >
                            <SelectTrigger className="w-full col-span-2">
                                <SelectValue placeholder="Store"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="S1">Techy&apos;s Long Eaton</SelectItem>
                                    <SelectItem value="S2">Techy&apos;s Burton on Trent</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </ModalBody>
                    <ModalFooter>                
                        <NextUIButton
                            type={"submit"}
                            onPress={handleSelectedStore}
                            variant="shadow"
                            className="w-full bg-[#f37d2d] text-white font-bold shadow-lg shadow-warning/40"
                        >Procced</NextUIButton>
                    </ModalFooter>
                </ModalContent>
            </Modal>
    )
}