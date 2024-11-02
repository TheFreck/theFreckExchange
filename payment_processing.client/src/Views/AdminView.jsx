import react, { useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Icon, Typography } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import CreateProduct from "./CreateProduct";
import CreateItems from "./CreateItems";
import ProductView from "./ProductView";

const accordionEnum = {
    none: 0,
    createProduct: 1,
    createItems: 2,
    modifyProducts: 3
}

export const AdminView = () => {
    const [accordionView,setAccordionView] = useState(accordionEnum.none);

    return <>
        <div>Admin View</div>
        <Accordion
            expanded={accordionView === accordionEnum.createProduct}
            onClick={() => setAccordionView(accordionView !== accordionEnum.createProduct ? accordionEnum.createProduct : accordionEnum.none)}
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
        <Accordion
            expanded={accordionView === accordionEnum.createItems}
            onClick={() => setAccordionView(accordionView !== accordionEnum.createItems ? accordionEnum.createItems : accordionEnum.none)}
        >
            <AccordionSummary
                expandIcon={<ExpandMore/>}
                aria-controls="createItems-content"
                id="createItemsAccordion"
            >
                <Typography className="createItemsTypography">Create Items</Typography>   
            </AccordionSummary>
            <AccordionDetails>
                <CreateItems />
            </AccordionDetails>
        </Accordion>
        <Accordion
            expanded={accordionView === accordionEnum.modifyProducts}
            onClick={() => setAccordionView(accordionView !== accordionEnum.modifyProducts ? accordionEnum.modifyProducts : accordionEnum.none)}
        >
            <AccordionSummary
            expandIcon={<ExpandMore/>}
            aria-controls="modifyProducts-content"
            id="modifyProductsAccordion"
        >
            <Typography className="modifyProductsTypography">Modify Products</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <ProductView />
        </AccordionDetails>
        </Accordion>
    </>
}

export default AdminView;