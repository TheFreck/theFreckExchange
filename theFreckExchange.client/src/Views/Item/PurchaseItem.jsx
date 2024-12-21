import react, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../../Context";
import { Box, Button, FormControl, Grid2, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { ImageCarousel } from "../../components/ImageCarousel";

export const PurchaseItem = ({product}) => {
    const {getItemsAsync,purchaseItemAsync,getImagesFromReferencesAsync} = useContext(ProductContext);
    const [items,setItems] = useState([]);
    const [narrowedItems,setNarrowedItems] = useState([]);
    const [availableAttributes,setAvailableAttributes] = useState({});
    const [orderedAttributes,setOrderedAttributes] = useState({});
    const [attributeChoices, setAttributeChoices] = useState({});
    const [imageObjects,setImageObjects] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [maxQty,setMaxQty] = useState(0);
    const [qtyError,setQtyError] = useState(false);

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
                getAttributesFromItems(itms,availables => {
                    let attChoicesObj = {};
                    Object.keys(availables).forEach(type => {
                        attChoicesObj[type] = "";
                    });
                    setAttributeChoices(attChoicesObj);
                    setAvailableAttributes(availables);
                })
            });
        });
    },[]);

    const getAttributesFromItems = (itms,cb) => {
        let availableAttributes = {};
        for(let itm of itms){
            for(let i=0; i<itm.attributes.length; i++){
                if(availableAttributes[itm.attributes[i].type] === undefined){
                    availableAttributes[itm.attributes[i].type] = new Set([itm.attributes[i].value]);
                }
                else{
                    availableAttributes[itm.attributes[i].type].add(itm.attributes[i].value);
                }
            }
        }
        cb(availableAttributes);
    }

    useEffect(() => {
        Object.entries(availableAttributes).sort((a,b) => a.order-b.order);
        setOrderedAttributes(availableAttributes);
    },[availableAttributes]);

    const soldOutMessage = (qty,max) => `You have selected more items ${qty} than are in stock ${max}`

    const narrowField = (choices,cb) => {
        let narrowed = Array.from(items);
        for(let i=0; i<narrowed.length; i++){
            let attArray = Object.entries(choices);
            let attarraylen = attArray.length;
            for(let j=0; j<attarraylen; j++){
                itemContainsAttribute(narrowed[i],attArray[j], doesContain => {
                    if(!doesContain){
                        narrowed.splice(i--,1);
                        attarraylen--;
                    }
                })
            }
        }
        cb(narrowed);
    }
    
    const itemContainsAttribute = (item,attribute,cb) => {
        if(attribute[1] === "" || item.attributes.find(a => a.type === attribute[0] && a.value === attribute[1])){
            cb(true);
        }
        else{
            cb(false);
        }
    }

    const handleSelection = (choice,type) => {
        let choices = {};
        if(choice === "attribute"){
            choices = {...attributeChoices,[type]: ""};
        }
        else{
            choices = {...attributeChoices,[type]:choice}
        }
        narrowField(choices,narrowedItems => {
            setMaxQty(narrowedItems.length);
            setAttributeChoices(choices);
            getAttributesFromItems(narrowedItems,narrowedAttributes => {
                setAvailableAttributes(narrowedAttributes);
            })
        })
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
                        Object.entries(attributeChoices).length && orderedAttributes && Object.entries(orderedAttributes).length && 
                        Object.entries(orderedAttributes).map((a,i) => 
                            <FormControl 
                                key={i}
                                sx={{width: "100%", marginBottom: "1vh",  visibility: `${i === 0 || (i > 0 && Object.entries(attributeChoices)[i-1][1] !== "") ? "visible" : "hidden"}` }}
                            >
                                <InputLabel>
                                    {a[0]}
                                </InputLabel>
                                <Select
                                    label={a[0]}
                                    onChange={(e) => handleSelection(e.target.value,a[0])}
                                    value={attributeChoices[a[0]]}
                                >
                                    <MenuItem
                                        disabled={Object.entries(attributeChoices)[i][1] === ""}
                                        name="attribute"
                                        value="attribute"
                                    >
                                        {Object.entries(attributeChoices)[i][1] === "" ?
                                        `Choose a ${a[0]}` : "Clear Selection"}
                                    </MenuItem>
                                    {
                                        a && a[1] && Object.values(Array.from(a[1])).map((t,j) => (
                                            <MenuItem
                                                key={j}
                                                id={a[0]}
                                                name={a[0]}
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
                                onClick={() => {
                                    getAttributesFromItems(items,availables => {
                                        let attChoicesObj = {};
                                        Object.keys(availables).forEach(type => {
                                            attChoicesObj[type] = "";
                                        });
                                        setAttributeChoices(attChoicesObj);
                                        setAvailableAttributes(availables);
                                    })}}
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