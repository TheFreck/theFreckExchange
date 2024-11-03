import react, { useContext, useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import CreateProduct from "./CreateProduct";
import CreateItems from "./CreateItems";
import { ProductContext } from "../Context";

const accordionEnum = {
    none: 0,
    createProduct: 1,
    createItems: 2,
    modifyProducts: 3
}

export const AdminView = () => {
    const {getProductsAsync} = useContext(ProductContext);
    const [accordionView,setAccordionView] = useState(accordionEnum.none);
    const [products,setProducts] = useState(new Set());
    const [ready,setReady] = useState(false);

    useEffect(() => {
        console.log("Prod context: ", ProductContext);
        getProductsAsync(prods => {
            setProducts(prods);
            setReady(true);
        })
    },[]);

    useEffect(() => {
        console.log("admin products: ", products);
    },[products]);

    return <>
        <Typography
            variant="h4"
            sx={{":hover": {
                cursor: "pointer"
            }}}
            onClick={() => setAccordionView(accordionEnum.none)}
        >
            Admin View
        </Typography>
        <Accordion
            expanded={accordionView === accordionEnum.createProduct}
            onClick={() => setAccordionView(accordionEnum.createProduct)}
        >
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="createProduct-content"
                id="createProductAccordion"
            >
                <Typography classsName="createProductTypography">Create Product</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <CreateProduct />
            </AccordionDetails>
        </Accordion>
        {console.log("admin products: ", products)}
        {
            products.size &&
        <Accordion
            expanded={accordionView === accordionEnum.createItems}
            onClick={() => setAccordionView(accordionEnum.createItems)}
        >
            <AccordionSummary
                expandIcon={<ExpandMore/>}
                aria-controls="createItems-content"
                id="createItemsAccordion"
            >
                <Typography >Create Items</Typography>   
            </AccordionSummary>
            <AccordionDetails>
                <CreateItems />
            </AccordionDetails>
        </Accordion>
                }
        <Accordion
            expanded={accordionView === accordionEnum.modifyProducts}
            onClick={() => setAccordionView(accordionEnum.modifyProducts)}
        >
            <AccordionSummary
            expandIcon={<ExpandMore/>}
            aria-controls="modifyProducts-content"
            id="modifyProductsAccordion"
        >
            <Typography >Modify Products</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <div>Place Holder</div> 
        </AccordionDetails>
        </Accordion>
    </>
}

export default AdminView;