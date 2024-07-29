import {Document, Font, Image, Page, pdf, StyleSheet, Text, View} from "@react-pdf/renderer";
import JsBarcode from "jsbarcode";
import logo from "../../public/logo.png";
import React from "react";
import {WebSocketPrinter} from "@/lib/websocket-printer";
import {saveAs} from "file-saver";

export default async function PrintReceipt(formData: {
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
}, items: {
    name: string;
    description: string;
    quantity: number;
    total: number;
    price: number
}[]){
// Create styles
    const styles = StyleSheet.create({
        tableRow: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            height: "auto",
            alignItems: "center",
            marginBottom: "1px",
        },
        cell: {
            flexDirection: "row",
            height: "auto",
            alignItems: "center",
            width: "50%",
        },
    });
    Font.register({
        family: "Open Sans",
        fonts: [
            {
                src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
            },
            {
                src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf",
                fontWeight: 700,
            },
            {
                src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-800.ttf",
                fontWeight: 800,
            },
        ],
    });
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, formData.invoiceNo ?? "00", {
        displayValue: false,
        height: 30,
    });
    const barcode = canvas.toDataURL();
    const OrderReceipt = (<Document title={"Invoice No-"+formData.invoiceNo}>
        <Page
            size={{width: 184.4, height: undefined}}
            style={{
                flexDirection: "column",
                // backgroundColor: "#ff0000",
                height: "auto",
                paddingTop: 16
            }}
        >
            <View
                style={{
                    flexDirection: "column",
                    height: "auto",
                    padding: "8px",
                }}
            >
                <View
                    style={{
                        height: "auto",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "3px",
                    }}
                >
                    <Image
                        src={logo.src}
                        style={{
                            width: "50%",
                        }}
                    />
                </View>
                <Text
                    style={{
                        fontFamily: "Open Sans",
                        fontSize: "12px",
                        fontWeight: 800,
                        width: "100%",
                        textAlign: "center",
                        marginBottom: "1px",
                    }}
                >
                    Techy&apos;s World Ltd
                </Text>
                <View
                    style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        width: "100%",
                        height: "auto",
                        alignItems: "center",
                        marginBottom: "4px",
                    }}
                >
                    <Text
                        style={{
                            fontSize: "8px",
                            paddingLeft: "12px",
                            paddingRight: "12px",
                            textAlign: "center",
                        }}
                    >
                        62 High Street, Long Eaton, NG10 1LP, Nottingham.
                    </Text>
                    <Text
                        style={{
                            fontSize: "8px",
                            paddingLeft: "12px",
                            paddingRight: "12px",
                            textAlign: "center",
                        }}
                    >
                        Tel: +44 0115773660
                    </Text>
                    <Text
                        style={{
                            fontSize: "8px",
                            paddingLeft: "12px",
                            paddingRight: "12px",
                            textAlign: "center",
                        }}
                    >
                        Website: www.mytechys.co.uk
                    </Text>
                    <Text
                        style={{
                            fontSize: "8px",
                            paddingLeft: "12px",
                            paddingRight: "12px",
                            textAlign: "center",
                        }}
                    >
                        Registration Number: 14091772
                    </Text>
                    <Text
                        style={{
                            fontSize: "8px",
                            paddingLeft: "12px",
                            paddingRight: "12px",
                            textAlign: "center",
                        }}
                    >
                        VAT Number: 469689803
                    </Text>
                </View>
                <View style={{marginTop: "4px"}}>
                    <View
                        style={{
                            justifyContent: "flex-start",
                            alignItems: "center",
                            flexDirection: "row",
                            gap: 1
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Open Sans",
                                fontWeight: 700,
                                fontSize: "8px",
                            }}
                        >
                            Invoice No :
                        </Text>
                        <Text
                            style={{
                                fontSize: "8px",
                                marginLeft: "1px",
                                fontWeight: "bold",
                            }}
                        >
                            {formData.invoiceNo}
                        </Text>
                    </View>
                    <View
                        style={{
                            justifyContent: "flex-start",
                            alignItems: "center",
                            flexDirection: "row",
                            gap: 1
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Open Sans",
                                fontWeight: 700,
                                fontSize: "8px",
                            }}
                        >
                            Date :
                        </Text>
                        <Text
                            style={{
                                fontSize: "8px",
                                fontWeight: "bold",
                            }}
                        >
                             {(formData.createdAt ?? new Date(Date.now())).toUTCString()}
                        </Text>
                    </View>
                    <View
                        style={{
                            justifyContent: "flex-start",
                            alignItems: "center",
                            flexDirection: "row",
                            gap: 1
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Open Sans",
                                fontWeight: 700,
                                fontSize: "8px",
                            }}
                        >
                            Prepared By :
                        </Text>
                        <Text
                            style={{
                                fontSize: "8px",
                                marginLeft: "1px",
                                fontWeight: "bold",
                            }}
                        >
                            {formData.preparedBy}
                        </Text>
                    </View>
                    <View
                        style={{
                            justifyContent: "flex-start",
                            alignItems: "center",
                            flexDirection: "row",
                            gap: 1
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Open Sans",
                                fontWeight: 700,
                                fontSize: "8px",
                            }}
                        >
                            Issue :
                        </Text>
                        <Text
                            style={{
                                fontSize: "8px",
                                marginLeft: "1px",
                                fontWeight: "bold",
                            }}
                        >
                            {formData.issue}
                        </Text>
                    </View>
                </View>
                <Text
                    style={{
                        fontFamily: "Open Sans",
                        fontWeight: 700,
                        fontSize: "10px",
                        marginTop: "4px",
                        width: "100%",
                        borderBottomWidth: "1px",
                        borderBottomColor: "#000000",
                    }}
                >
                    Customer Information
                </Text>
                <View style={{marginTop: "2px", flexDirection: "column"}}>
                    <View
                        style={{
                            flexDirection: "row",
                            height: "auto",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Open Sans",
                                fontWeight: 700,
                                fontSize: "8px",
                            }}
                        >
                            Name :
                        </Text>
                        <Text
                            style={{
                                fontSize: "8px",
                                marginLeft: "1px",
                                fontWeight: "bold",
                            }}
                        >
                            {formData.customerName}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            height: "auto",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Open Sans",
                                fontWeight: 700,
                                fontSize: "8px",
                            }}
                        >
                            Email :
                        </Text>
                        <Text
                            style={{
                                fontSize: "8px",
                                marginLeft: "1px",
                                fontWeight: "bold",
                            }}
                        >
                            {formData.customerEmail === "" ? "Not included" : formData.customerEmail}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            height: "auto",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Open Sans",
                                fontWeight: 700,
                                fontSize: "8px",
                            }}
                        >
                            Phone :
                        </Text>
                        <Text
                            style={{
                                fontSize: "8px",
                                marginLeft: "1px",
                                fontWeight: "bold",
                            }}
                        >
                            {formData.customerPhone === "" ? "Not included" : formData.customerPhone}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        marginTop: "4px",
                        width: "100%",
                        backgroundColor: "#000000",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "2px",
                    }}
                >
                    <Text
                        style={{

                            fontWeight: 700,
                            fontSize: "8px",
                            color: "#ffffff",
                            width: "70%",
                        }}
                    >
                        Item Name
                    </Text>
                    <Text
                        style={{

                            fontWeight: 700,
                            fontSize: "8px",
                            color: "#ffffff",
                            width: "10%",
                        }}
                    >
                        QTY
                    </Text>
                    <Text
                        style={{

                            fontWeight: 700,
                            fontSize: "8px",
                            color: "#ffffff",
                            width: "20%",
                            textAlign: "right",
                        }}
                    >
                        Price
                    </Text>
                </View>
                <View
                    style={{
                        marginVertical: "1px",
                        flexDirection: "column",
                        paddingBottom: "1px",
                        borderBottomWidth: "1px",
                        borderBottomColor: "#000000",
                    }}
                >
                    {items.map((item: any, index: number) => (
                            <View
                                key={index}
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    height: "auto",
                                    alignItems: "flex-start",
                                    marginBottom: "1px",
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "column",
                                        height: "auto",
                                        alignItems: "flex-start",
                                        width: "70%",
                                        justifyContent: "flex-start",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: "Open Sans",
                                            fontWeight: 800,
                                            fontSize: "7px",
                                        }}
                                    >
                                        {item?.name}
                                    </Text>
                                    {item.description !== "" && (
                                        <Text
                                            style={{
                                                fontSize: "7px",
                                            }}
                                        >
                                            Description: {item.description}
                                        </Text>
                                    )}
                                </View>
                                <Text
                                    style={{
                                        fontFamily: "Open Sans",
                                        fontWeight: 700,
                                        fontSize: "7px",
                                        width: "10%",
                                        textAlign: "center",
                                    }}
                                >
                                    {item.quantity}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: "Open Sans",
                                        fontWeight: 700,
                                        fontSize: "7px",
                                        width: "20%",
                                        textAlign: "right",
                                    }}
                                >
                                    £{Number(item?.total).toFixed(2)}
                                </Text>
                            </View>
                        )
                    )}
                </View>
                <View style={styles.tableRow}>
                    <View
                        style={[
                            styles.cell,
                            {
                                justifyContent: "flex-start",
                            },
                        ]}
                    >
                        <Text
                            style={{
                                fontFamily: "Open Sans",
                                fontWeight: 700,
                                fontSize: "7px",
                            }}
                        >
                            Sub Total
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.cell,
                            {
                                justifyContent: "flex-end",
                            },
                        ]}
                    >
                        <Text
                            style={{
                                fontSize: "7px",
                                fontWeight: "bold",
                            }}
                        >
                            £{Number(formData.subTotal).toFixed(2)}
                        </Text>
                    </View>
                </View>
                <View style={styles.tableRow}>
                    <View
                        style={[
                            styles.cell,
                            {
                                justifyContent: "flex-start",
                            },
                        ]}
                    >
                        <Text
                            style={{
                                fontFamily: "Open Sans",
                                fontWeight: 700,
                                fontSize: "7px",
                            }}
                        >
                            Discount
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.cell,
                            {
                                justifyContent: "flex-end",
                            },
                        ]}
                    >
                        <Text
                            style={{
                                fontSize: "7px",
                                fontWeight: "bold",
                            }}
                        >
                            - £
                            {Number(formData.discount).toFixed(2)}
                        </Text>
                    </View>
                </View>
                <View style={styles.tableRow}>
                    <View
                        style={[
                            styles.cell,
                            {
                                justifyContent: "flex-start",
                            },
                        ]}
                    >
                        <Text
                            style={{
                                fontFamily: "Open Sans",
                                fontWeight: 700,
                                fontSize: "7px",
                            }}
                        >
                            Vat
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.cell,
                            {
                                justifyContent: "flex-end",
                            },
                        ]}
                    >
                        <Text
                            style={{
                                fontSize: "7px",
                                fontWeight: "bold",
                            }}
                        >
                            + £{Number(formData.vat).toFixed(2)}
                        </Text>
                    </View>
                </View>
                <View
                    style={[
                        styles.tableRow,
                        {
                            paddingBottom: "1px",
                            borderBottomWidth: "1px",
                            borderBottomColor: "#000000",
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.cell,
                            {
                                justifyContent: "flex-start",
                            },
                        ]}
                    >
                        <Text
                            style={{
                                fontFamily: "Open Sans",
                                fontWeight: 700,
                                fontSize: "8px",
                            }}
                        >
                            Total
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.cell,
                            {
                                justifyContent: "flex-end",
                            },
                        ]}
                    >
                        <Text
                            style={{
                                fontFamily: "Open Sans",
                                fontWeight: 700,
                                fontSize: "8px",
                            }}
                        >
                            £
                            {Number(formData.total).toFixed(2)}
                        </Text>
                    </View>
                </View>
                <View style={styles.tableRow}>
                    <View
                        style={[
                            styles.cell,
                            {
                                justifyContent: "flex-start",
                            },
                        ]}
                    >
                        <Text
                            style={{
                                fontFamily: "Open Sans",
                                fontWeight: 700,
                                fontSize: "7px",
                            }}
                        >
                            Paid
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.cell,
                            {
                                justifyContent: "flex-end",
                            },
                        ]}
                    >
                        <Text
                            style={{
                                fontSize: "7px",
                                fontWeight: "bold",
                            }}
                        >
                            £
                            {Number(formData.paid).toFixed(2)}
                        </Text>
                    </View>
                </View>
                <View style={styles.tableRow}>
                    <View
                        style={[
                            styles.cell,
                            {
                                justifyContent: "flex-start",
                            },
                        ]}
                    >
                        <Text
                            style={{
                                fontFamily: "Open Sans",
                                fontWeight: 700,
                                fontSize: "7px",
                            }}
                        >
                            Change
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.cell,
                            {
                                justifyContent: "flex-end",
                            },
                        ]}
                    >
                        <Text
                            style={{
                                fontSize: "7px",
                                fontWeight: "bold",
                            }}
                        >
                            £
                            {Number(formData.change).toFixed(2)}
                        </Text>
                    </View>
                </View>
                <View
                    style={[
                        styles.tableRow,
                        {
                            paddingBottom: "1px",
                            borderBottomWidth: "1px",
                            borderBottomColor: "#000000",
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.cell,
                            {
                                justifyContent: "flex-start",
                            },
                        ]}
                    >
                        <Text
                            style={{
                                fontFamily: "Open Sans",
                                fontWeight: 700,
                                fontSize: "8px",
                            }}
                        >
                            Balance
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.cell,
                            {
                                justifyContent: "flex-end",
                            },
                        ]}
                    >
                        <Text
                            style={{
                                fontFamily: "Open Sans",
                                fontWeight: 700,
                                fontSize: "8px",
                            }}
                        >
                            £
                            {Number(formData.balance).toFixed(2)}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        marginTop: "1px",
                        width: "100%",
                        borderBottomWidth: "1px",
                        borderBottomColor: "#000000",
                    }}
                ></View>
                <Text
                    style={{
                        marginTop: "10px",
                        fontFamily: "Open Sans",
                        fontWeight: 600,
                        fontSize: "6px",
                        textAlign: "center",
                        alignItems: "center",
                    }}
                >
                    We hope you enjoyed your purchase at Techy&apos;s! We&apos;re always
                    looking for ways to improve, so please feel free to leave us a
                    review on Google or Facebook.
                </Text>
                <Text
                    style={{
                        marginTop: "10px",
                        fontFamily: "Open Sans",
                        fontWeight: 700,
                        fontSize: "10px",
                        textAlign: "center",
                        alignItems: "center",
                    }}
                >
                    Terms & Condition
                </Text>
                <Text
                    style={{
                        fontFamily: "Open Sans",
                        fontWeight: 500,
                        fontSize: "6px",
                        textAlign: "center",
                        alignItems: "center",
                    }}
                >
                    Please Read the Information below completely then fill out before submitting. I
                    grant permission to Techys to perform any action deemed necessary in an attempt to
                    repair my device. Furthermore, I release Techys from any liability for any data loss
                    which may occur, or component failures occurring during attempted repair, testing,
                    or at any other time. Techys is not responsible for loss of profit or any direct,
                    indirect, special, incidental, or consequential damage occurring during or
                    after device service. Furthermore, I release Techys from any liability for any data loss
                    which may occur, or component failures occurring during attempted repair, testing,
                    or at any other time. Techys is not responsible for loss of profit or any direct,
                    indirect, special, incidental, or consequential damage occurring during or after device service.
                </Text>
                <Text
                    style={{
                        marginTop: "35px",
                        fontFamily: "Open Sans",
                        fontWeight: 700,
                        fontSize: "8px",
                        paddingTop: "1px",
                        borderTopWidth: "1px",
                        borderTopColor: "#000000",
                        width: "50vw"
                    }}
                >
                    Customer Signature
                </Text>
                <View
                    style={{
                        marginTop: "4px",
                        marginBottom: "4px",
                        width: "100%",
                        height: "30px",
                    }}
                >
                    <Image src={barcode}/>
                </View>
                <View
                    style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        fontFamily: "Open Sans",
                        fontWeight: 700,
                        fontSize: "10px",
                    }}
                >
                    <Text>Thanks for visiting</Text>
                    <Text>Techy&apos;s</Text>
                </View>
            </View>
            <Text
                style={{
                    marginTop: "10px",
                    backgroundColor: "#000000",
                    color: "#ffffff",

                    fontWeight: 700,
                    fontSize: "6px",
                    textAlign: "center",
                    alignItems: "center",
                    paddingBottom: "2px",
                }}
            >
                System developed by Techy&apos;s World Ltd
            </Text>
        </Page>
    </Document>
    )
    const blob = pdf(OrderReceipt).toBlob();
    blob.then((data) => {
        handlePrint(data, formData.invoiceNo ?? "00");
    });

    function handlePrint(data: Blob, invoiceNo: string) {
        const printService = new WebSocketPrinter({
            onConnect: function () {
            },
            onDisconnect: function () {
            },
            onUpdate: function () {
            },
        });

        function printPDF() {
            const blobToBase64 = (blob: Blob) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                return new Promise((resolve) => {
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
                });
            };
            blobToBase64(data).then((res) => {
                const base64 = (res as string).split(",")[1];
                printService.submit({
                    type: "INVOICE",
                    url: "file.pdf",
                    file_content: base64,
                });
            });
        }

        if (printService.isConnected()) {
            printPDF();
        } else {
            setTimeout(() => {
                if (printService.isConnected()) {
                    printPDF();
                } else {
                    alert("WebApp Hardware Bridge not running");
                    saveAs(data, "Invoice No-" + invoiceNo + ".pdf");
                    // window.open(encodedString);
                }
            }, 1000);
        }
    }

}