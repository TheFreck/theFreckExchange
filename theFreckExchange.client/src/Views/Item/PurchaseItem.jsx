import react, { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Grid2, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { ImageCarousel } from "../../components/ImageCarousel";
import {getItemsAsync,purchaseItemAsync,getImagesFromReferencesAsync} from "../../helpers/helpersWelcome";
import { AccountContext } from "../../Context";

export const PurchaseItem = ({product}) => {
    const {addToCart} = useContext(AccountContext);
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

    const handleSelection = (choice,type) => {
        let choices = {};
        if(choice === "attribute"){
            choices = {...attributeChoices,[type]: ""};
        }
        else{
            choices = {...attributeChoices,[type]:choice}
        }
        narrowField(choices,narrowedItems => {
            setAttributeChoices(choices);
            if(Object.values(choices).filter(a => a === "").length === 0){
                setMaxQty(narrowedItems[0].quantity);
            }
            getAttributesFromItems(narrowedItems,narrowedAttributes => {
                setAvailableAttributes(narrowedAttributes);
            })
        })
    }

    const narrowField = (choices,cb) => {
        let valid = Object.entries(choices).filter(c => c[1] !== "");
        let narrowed = [];
        for(let itm in items){
            let matches = true;
            for(let at of items[itm].attributes){
                let allItmAtts = Object.entries(at);
                let attributes = [allItmAtts[0][1],allItmAtts[1][1]];
                for(let choice of valid){
                    if(choice[0]===attributes[0] && choice[1] !== attributes[1]){
                        matches = false;
                        break;
                    }
                }
                if(!matches) break;
            }
            if(matches) narrowed.push(items[itm]);
        }
        cb(narrowed);
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
                                disabled={Object.values(attributeChoices).filter(a => a === "").length > 0}
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
                                sx={{width: "40%"}}
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
                                sx={{width: "40%"}}
                                variant="contained"
                                onClick={() => {
                                    let attArray = [];
                                    for(let att of Object.entries(attributeChoices)){
                                        attArray.push({type:att[0],value: att[1]});
                                    }
                                    addToCart({
                                        item: narrowedItems[0],
                                        quantity,
                                        totalPrice: narrowedItems[0].price * quantity
                                    },() => {
                                        console.log("added to cart");
                                    });
                                }
                                }
                            >
                                Add to Cart
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