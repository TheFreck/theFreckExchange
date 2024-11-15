import react, { useCallback, useContext, useEffect, useState } from "react";
import { Box, Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { AccountContext, ProductContext } from "../../Context";
import CreateItems from "../Item/CreateItems";
import CreateProduct from "../Product/CreateProduct";
import ModifyProduct from "../Product/ModifyProduct";

const accordionEnum = {
    home: 0,
    createProduct: 1,
    createItems: 2,
    updateProduct: 3
}

export const AdminView = () => {
    const [accordionView, setAccordionView] = useState(accordionEnum.home);
    const [products, setProducts] = useState(new Set());
    const [ready, setReady] = useState(false);
    const {adminView,adminEnum} = useContext(AccountContext);
    const { getProductsAsync } = useContext(ProductContext);
    

    useEffect(() => {
        getProducts(prods => {
            setProducts(prods);
            setReady(!ready);
        });
    }, []);

    const getProducts = (cb) => {
        getProductsAsync(prods => {
            cb(prods);
        })
    }

    const created = () => {
        getProducts(p => {
            setProducts(p);
        })
    }

    const CreateItemsCallback = useCallback(() => <CreateItems products={products} />,[products]);

    const AdminCallback = useCallback(() => <Box>
        <Typography
            variant="h4"
            sx={{
                ":hover": {
                    cursor: "pointer"
                }
            }}
            onClick={() => setAccordionView(accordionEnum.home)}
        >
            Admin View
        </Typography>
        <Accordion
            expanded={adminView === adminEnum.createProduct}
            // onClick={() => setAccordionView(accordionEnum.createProduct)}
        >
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="createProduct-content"
                id="createProductAccordion"
            >
                <Typography >Create Product</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <CreateProduct created={created} />
            </AccordionDetails>
        </Accordion>
        {
            products && products.size > 0 &&
            <Accordion
                expanded={adminView === adminEnum.createItems}
                // onClick={() => {
                //     setAccordionView(accordionEnum.createItems);
                // }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="createItems-content"
                    id="createItemsAccordion"
                >
                    <Typography >Create Items</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <CreateItemsCallback />
                </AccordionDetails>
            </Accordion>
        }
        <Accordion
            expanded={adminView === adminEnum.updateProduct}
            // onClick={() => setAccordionView(accordionEnum.updateProduct)}
        >
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="modifyProducts-content"
                id="modifyProductsAccordion"
            >
                <Typography >Modify Products</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <ModifyProduct 
                    products={products}
                />
            </AccordionDetails>
        </Accordion>
    </Box>,[ready,accordionView]);

    return <AdminCallback />
}

// export default AdminView;