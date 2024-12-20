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

    const getAttributesFromItems = (itms,cb) => {
        let availables = {};
        for(let itm of itms){
            for(let i=0; i<itm.attributes.length; i++){
                if(availables[itm.attributes[i].type] === undefined){
                    availables[itm.attributes[i].type] = new Set([itm.attributes[i].value]);
                }
                else{
                    availables[itm.attributes[i].type].add(itm.attributes[i].value);
                }
            }
        }
        cb(availables);
    }

    const groupItemsByAttribute = (itms) => {
        let types = {};
        itms.forEach(element => {
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
        narrowField(narrowed => {
            setMaxQty(narrowed.length);
            setNarrowedItems(narrowed);
        });
    },[attributeChoices]);

    const soldOutMessage = (qty,max) => `You have selected more items ${qty} than are in stock ${max}`

    const narrowField = (cb) => {
        let narrowed = items;
        for(let i=0; i<narrowed.length; i++){
            let attArray = Object.entries(attributeChoices);
            for(let j=0; j<attArray.length; j++){
                if(!itemContainsAttribute(items[i],attArray[j])){
                    narrowed.splice(i--,1);
                }
            }
        }
        getAttributesFromItems(narrowed,availables => {
            setAttributes(availables);
            cb(narrowed);
        });
    }

    const itemContainsAttribute = (item,attribute) => {
        if(attribute[1] === "") return true;
        if(item.attributes.find(a => a.type === attribute[0] && a.value === attribute[1])){
            return true;
        }
        return false;
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
                    sx={{width: "30vw",  height: "20vh"}}
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
                                        a && a[1] && Object.values(Array.from(a[1])).map((t,j) => (
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
                        sx={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}
                    >
                        <FormControl
                            sx={{width: "30%"}}
                        >
                            <TextField 
                                label="Quantity"
                                type="number"
                                error={qtyError}
                                onChange={(q) => {
                                    if(parseInt(q.target.value) > maxQty){
                                        setQtyError(true);
                                    }
                                    else{
                                        setQtyError(false);
                                    }
                                    setQuantity(parseInt(q.target.value))
                                }
                            }
                                value={quantity}
                            />
                        </FormControl>
                        <Box 
                            sx={{width: "auto", display: "flex", flexDirection: "row", justifyContent: "space-around"}}
                        >
                            <Button
                                sx={{width: "30%"}}
                                onClick={() => groupItemsByAttribute(items)}
                            >
                                Reset Attributes
                            </Button>
                            <Button
                                sx={{width: "30%", padding: "0 4vw"}}
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
                        </Box>
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
                    sx={{height: "auto", width: "50vw", textAlign: "justify"}}
                >
                    <TextField
                        label="Description"
                        multiline
                        color="standard"
                        disabled
                        sx={{
                            width: "100%", 
                            "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "black"
                            },
                            "& .css-n322op-MuiFormLabel-root-MuiInputLabel-root.Mui-disabled": {
                                color: "#555555"
                            }
                        }}
                        value={product.productDescription}
                    />
                    
                </Grid2>
            </Grid2>
        </Grid2>
    );
}

export default PurchaseItem;