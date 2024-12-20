import react, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../../Context";
import { Box, Button, FormControl, Grid2, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { ImageCarousel } from "../../components/ImageCarousel";

export const PurchaseItem = ({product}) => {
    const {getItemsAsync,purchaseItemAsync,getImagesFromReferencesAsync} = useContext(ProductContext);
    const [items,setItems] = useState([]);
    const [attributes,setAttributes] = useState([]);
    const [attributeChoices, setAttributeChoices] = useState({});
    const [imageObjects,setImageObjects] = useState([]);
    const [narrowedItems,setNarrowedItems] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [maxQty,setMaxQty] = useState(0);
    const [qtyError,setQtyError] = useState(false);
    const [orderedAttributes,setOrderedAttributes] = useState([]);

    useEffect(() => {
        getImagesFromReferencesAsync(product.imageReferences,imgs => {
            for(let img of imgs){
                img.image = window.atob(img.image);
            }
            setImageObjects(imgs);
            getItemsAsync(product.name,itms => {
                setItems(itms);
                setNarrowedItems(itms);
                setMaxQty(itms.length);
                groupItemsByAttribute(itms);
            });
        });
    },[]);

    const groupItemsByAttribute = (items) => {
        let types = {};
        items.forEach(element => {
            element.attributes.forEach(attribute => {
                if(!Object.keys(types).includes(attribute.type)){
                    types[attribute.type] = {[attribute.value]: []};
                }
                if(types[attribute.type][attribute.value] === undefined){
                    types[attribute.type][attribute.value] = [];
                }
                types[attribute.type][attribute.value].push(element);
            })
        });
        let attChoices = {};
        Object.entries(types).forEach(type => {
            attChoices[type[0]] = "";
        })
        setAttributeChoices(attChoices);
        setAttributes(types);
    }

    useEffect(() => {
        Object.entries(attributes).sort((a,b) => a.order-b.order);
        setOrderedAttributes(attributes);
    },[attributes]);

    useEffect(() => {
        if(Object.entries(attributeChoices).length === 0) return;
        narrowField();
    },[attributeChoices]);

    useEffect(() => console.log("narrowedItems: ", narrowedItems.map(i => i)),[narrowedItems]);

    const soldOutMessage = (qty,max) => `You have selected more items ${qty} than are in stock ${max}`

    const narrowField = () => {
        console.log("items: ", items.map(i => i));
        let narrowed = items;
        for(let i=0; i<items.length; i++){
            
        }
        console.log("narrowed: ", narrowed);
        setNarrowedItems(narrowed);
    }
    
    return (
        <Grid2
            container
            sx={{width: "80vw",border: "solid"}}
        >
            <Grid2
                container
            >
                <ImageCarousel
                    imageObjects={imageObjects}
                    minHeight={"20vh"}
                    maxHeight={"60vh"}
                    height={"30vh"}
                    width={"33vw"}
                    isGrouped={false}
                    isAutoPlay={false}
                />
            </Grid2>
            <Grid2
                sx={{marginTop: "1vh", width: "100%", display:"flex", flexDirection: "row"}}
            >
                <Grid2
                    sx={{width: "30vw",  height: "20vh", width: "20vw"}}
                >
                    {
                        orderedAttributes && Object.entries(orderedAttributes).length && 
                        Object.entries(orderedAttributes).map((a,i) => 
                            <FormControl 
                                key={i}
                                sx={{width: "100%", marginBottom: "1vh", visibility: `${i === 0 || (i > 0 && Object.entries(attributeChoices)[i-1][1] !== "") ? "visible" : "hidden"}`}}
                            >
                                <InputLabel>
                                    {a[0]}
                                </InputLabel>
                                <Select
                                    label={a[0]}
                                    onChange={(att) => {
                                        setAttributeChoices({...attributeChoices,[a[0]]:att.target.value})
                                    }}
                                    value={attributeChoices[a[0]]}
                                >
                                    <MenuItem
                                        disabled
                                        name="attribute"
                                        value="attribute"
                                    >
                                        Choose a {a[0]}
                                    </MenuItem>
                                    {
                                        a && a[1] && Object.keys(a[1]).map((t,j) => (
                                            <MenuItem
                                                key={j}
                                                name={t}
                                                value={t}
                                            >
                                                {t}
                                            </MenuItem>
                                                
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        )
                    }
                    <Grid2
                        sx={{width: "100%", display: "flex", flexDirection: "row"}}
                    >
                        <FormControl
                            sx={{width: "70%"}}
                        >
                            <TextField 
                                label="Quantity"
                                type="number"
                                error={qtyError}
                                onChange={(q) => {
                                    if(parseInt(q.target.value) > maxQty){
                                        setQtyError(true);
                                    }
                                        setQuantity(parseInt(q.target.value))
                                }
                            }
                                value={quantity}
                            />
                        </FormControl>
                        <Button
                            sx={{width: "30%"}}
                            variant="contained"
                            onClick={() => {
                                let attArray = [];
                                for(let att of Object.entries(attributeChoices)){
                                    attArray.push({type:att[0],value: att[1]});
                                }
                                purchaseItemAsync({name: product.name,attributes: attArray},quantity)
                            }
                            }
                        >
                            Purchase
                        </Button>
                    </Grid2>
                    {
                        qtyError &&
                        <Typography
                            color="error"
                        >
                            {soldOutMessage(quantity,maxQty)}
                        </Typography>
                    }
                </Grid2>
                <Grid2
                    width={8}
                    sx={{border: "solid", borderWidth: "1px", height: "20vh", width: "60vw"}}
                >
                    {product.productDescription}
                </Grid2>
            </Grid2>
        </Grid2>
    );
}

export default PurchaseItem;