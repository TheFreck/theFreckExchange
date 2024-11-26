import { Label } from "@mui/icons-material";
import { Box, Button, FormControlLabel, FormGroup, Grid2, Modal, Switch, TextField, Typography } from "@mui/material";
import axios from "axios";
import react, { useEffect, useState } from "react";


const activeCategoryEnum = {
    none: 0,
    lt: 1,
    lm: 2,
    lb: 3,
    rt: 4,
    rm: 5,
    rb: 6
}

export const Descriptions = ({background,isConfig,config}) => {
    const [open,setOpen] = useState(false);
    const [description,setDescription] = useState("");
    const [title,setTitle] = useState("");
    const [titleEdit,setTitleEdit] = useState(false);
    const [leftTop,setLeftTop] = useState("");
    const [leftTopUrl,setLeftTopUrl] = useState("");
    const [leftTopDescription,setLeftTopDescription] = useState("");
    const [leftTopEdit,setLeftTopEdit] = useState(false);
    const [leftMiddle,setLeftMiddle] = useState("");
    const [leftMiddleUrl,setLeftMiddleUrl] = useState("");
    const [leftMiddleDescription,setLeftMiddleDescription] = useState("");
    const [leftMiddleEdit,setLeftMiddleEdit] = useState(false);
    const [leftBottom,setLeftBottom] = useState("");
    const [leftBottomUrl,setLeftBottomUrl] = useState("");
    const [leftBottomDescription,setLeftBottomDescription] = useState("");
    const [leftBottomEdit,setLeftBottomEdit] = useState(false);
    const [rightTop,setRightTop] = useState("");
    const [rightTopUrl,setRightTopUrl] = useState("");
    const [rightTopDescription,setRightTopDescription] = useState("");
    const [rightTopEdit,setRightTopEdit] = useState(false);
    const [rightMiddle,setRightMiddle] = useState("");
    const [rightMiddleUrl,setRightMiddleUrl] = useState("");
    const [rightMiddleDescription,setRightMiddleDescription] = useState("");
    const [rightMiddleEdit,setRightMiddleEdit] = useState(false);
    const [rightBottom,setRightBottom] = useState("");
    const [rightBottomUrl,setRightBottomUrl] = useState("");
    const [rightBottomDescription,setRightBottomDescription] = useState("");
    const [rightBottomEdit,setRightBottomEdit] = useState(false);
    const [productName,setProductname] = useState("");
    const [productNameEdit,setProductnameEdit] = useState(false);
    const [activeCategory,setActiveCategory] = useState(activeCategoryEnum.none);

    const descriptionApi = axios.create({
        baseURL: `https://localhost:7299/Site`
    });
    
    useEffect(() => {
        setTitle(config.categoryTitle);
        setLeftTop(config.categories[0].name);
        setLeftTopDescription(config.categories[0].description);
        setLeftMiddle(config.categories[1].name);
        setLeftMiddleDescription(config.categories[1].description);
        setLeftBottom(config.categories[2].name);
        setLeftBottomDescription(config.categories[2].description);
        setRightTop(config.categories[3].name);
        setRightTopDescription(config.categories[3].description);
        setRightMiddle(config.categories[4].name);
        setRightMiddleDescription(config.categories[4].description);
        setRightBottom(config.categories[5].name);
        setRightBottomDescription(config.categories[5].description);
    },[]);

    useEffect(() => {
        setOpen(true);
    },[description])
    
    const handleClose = () => {
        setOpen(false);
    }

    const getDescription = (product) => {
        descriptionApi.get(product)
        .then(yup => {
            let reggy1 = new RegExp("(?=<sup)(.*?)(?<=>)|(<a)(.*?)(?<=>)|(</a>)|(&#91)(.*?)(?<=&#93)","g");
            let reggy2 = new RegExp(">;","g");
            let reggied = yup.data.replace(reggy1,"");
            let final = reggied.replace(reggy2,',');
            setDescription(`<div>${final}</div>`);
    })
        .catch(nope => console.error(nope));
    }

    const saveChanges = () => {

    }

    const DescriptionModal = ({isConfig}) => {
        if(activeCategory === activeCategoryEnum.none) return;
        const [isUrl,setIsUrl] = useState(false);
        let desc, setDesc, url, setUrl;
        
        switch (activeCategory) {
            case activeCategoryEnum.lt:
                desc = leftTopDescription;
                setDesc = setLeftTopDescription;
                url = leftTopUrl;
                setUrl = setLeftTopUrl;
                break;
            case activeCategoryEnum.lm:
                desc = leftMiddleDescription;
                setDesc = setLeftMiddleDescription;
                url = leftMiddleUrl;
                setUrl = setLeftMiddleUrl;
                break;
            case activeCategoryEnum.lb:
                desc = leftBottomDescription;
                setDesc = setLeftBottomDescription;
                url = leftBottomUrl;
                setUrl = setLeftBottomUrl;
                break;
            case activeCategoryEnum.rt:
                desc = rightTopDescription;
                setDesc = setRightTopDescription;
                url = rightTopUrl;
                setUrl = setRightTopUrl;
                break;
            case activeCategoryEnum.rm:
                desc = rightMiddleDescription;
                setDesc = setRightMiddleDescription;
                url = rightMiddleUrl;
                setUrl = setRightMiddleUrl;
                break;
            case activeCategoryEnum.rb:
                desc = rightBottomDescription;
                setDesc = setRightBottomDescription;
                url = rightBottomUrl;
                setUrl = setRightBottomUrl;
                break;
        }

        return <>
            {description !== "" &&
                <Modal
                    open={open}
                    onClose={handleClose}
                >
                    <>
                    {!isConfig &&
                        <Box
                            sx={{
                                width: "70vw",
                                height: "70vh",
                                justifyContent: "center", textAlign: "center",
                                margin: "10vw auto",
                                background: "tan",
                                color: "black",
                                border: "solid",
                                padding: "1em",
                                overflowY: "scroll",
                            }}
                        >
                            <Typography
                                variant="h4"
                            >
                                {productName}
                            </Typography>
                            {description !== "" && <div dangerouslySetInnerHTML={{__html:description}} />}
                            <br/>
                            <Typography>
                                This description brought to you by Wikipedia.
                            </Typography>
                        </Box>
                    }
                    {isConfig &&
                        <Box
                            sx={{width: "80vw", height: "80vh", border: "solid", padding: isConfig ? "2vw" : "auto", margin: "auto", marginTop: "10vh", background: "tan", display: "flex",flexDirection: "column"}}
                        >
                            <Grid2
                            size={4}
                                sx={{display: "flex",flexDirection: "row", width: "25vw", marginLeft: "10vw", marginRight: "auto"}}
                            >
                                <Typography
                                    sx={{margin: "auto", padding: "auto"}}
                                >
                                    Typed Description
                                </Typography>
                                <Switch
                                    onClick={() => setIsUrl(!isUrl)}
                                />
                                <Typography
                                    sx={{margin: "auto", padding: "auto"}}
                                >
                                    URL
                                </Typography>
                            </Grid2>
                            {isUrl && 
                                <TextField
                                    label="URL"
                                    onChange={e => setUrl(e.target.value)}
                                    value={url}
                                />
                            }
                            {!isUrl &&
                                <TextField
                                    label="Description"
                                    multiline
                                    onChange={e => setDesc(e.target.value)}
                                    value={desc}
                                />
                            }
                            <Button
                                onClick={setOpen(false)}
                            >
                                Save Description
                            </Button>
                        </Box>
                    }
                    </>
                </Modal>
            }
        </>
    }

    return <>
    <Box
            sx={{
                backgroundImage: `url(${background})`, 
                backgroundRepeat: "no-repeat", 
                backgroundSize: "cover", 
                backgroundColor: "rgba(255,255,255,.2)", 
                backgroundBlendMode: "lighten",
                height: "66%", 
                color: "blackS"
            }}
        >
        {!isConfig &&
            <Typography
                variant="h3"
            >
                {title}
            </Typography>
        }
        {isConfig &&
            <TextField
                sx={{display: "flex",flexDirection: "row", justifyContent: "center", textAlign: "center", input: {textAlign: "center"}}}
                variant="standard"
                onChange={e => {
                    setTitle(e.target.value);
                }}
                value={title}
            />
        }
        <Grid2 container size={12}
            sx={{ display: "flex", margin: "2em" }}
        >
            <Grid2 size={2}>
            </Grid2>
            <Grid2 size={4}
                sx={{ padding: "1em", display: "flex", flexDirection: "column", alignItems: "center" }}
            >
                <Grid2 size={3}>
                    {!isConfig &&
                        <Typography
                            sx={{ width: "100%", ":hover": {cursor: "pointer"} }}
                            variant="h4"
                            onClick={() => {
                                setProductname(leftTop);
                                getDescription(leftTop);
                            }}
                        >
                            {leftTop}
                        </Typography>
                    }
                    {
                        isConfig &&
                        <TextField
                            sx={{display: "flex",flexDirection: "row", justifyContent: "center", input: {textAlign: "center"}}}
                            variant="standard"
                            onChange={e => {
                                setLeftTop(e.target.value);
                            }}
                            value={leftTop}
                        />
                    }
                    {isConfig &&
                        <Button
                            onClick={() => {
                                setActiveCategory(activeCategoryEnum.lt);
                                setDescription(leftTopDescription);
                            }}
                        >
                            Add Description
                        </Button>

                    }
                </Grid2>
                <Grid2 size={3}>
                    {!isConfig &&
                        <Typography
                            sx={{ width: "100%", ":hover": {cursor: "pointer"} }}
                            variant="h4"
                            onClick={() => {
                                getDescription(leftMiddle);
                                setProductname(leftMiddle);
                            }}
                        >
                            {leftMiddle}
                        </Typography>
                    }
                    {isConfig &&
                        <TextField
                            sx={{display: "flex",flexDirection: "row", justifyContent: "center", input: {textAlign: "center"}}}
                            variant="standard"
                            onChange={e => {
                                setLeftMiddle(e.target.value);
                            }}
                            value={leftMiddle}
                        />
                    }
                    {isConfig &&
                        <Button
                            onClick={() => {
                                setActiveCategory(activeCategoryEnum.lm);
                                setDescription(leftMiddleDescription);
                            }}
                        >
                            Add Description
                        </Button>

                    }
                </Grid2>
                <Grid2 size={3}>
                    {!isConfig &&
                        <Typography
                            sx={{ width: "100%", ":hover": {cursor: "pointer"} }}
                            variant="h4"
                            onClick={() => {
                                setProductname(leftBottom);
                                getDescription(leftBottom);
                            }}
                        >
                            {leftBottom}
                        </Typography>
                    }
                    {isConfig &&
                        <TextField
                            sx={{display: "flex",flexDirection: "row", justifyContent: "center", input: {textAlign: "center"}}}
                            variant="standard"
                            onChange={e => {
                                setLeftBottom(e.target.value);
                            }}
                            value={leftBottom}
                        />
                    }
                    {isConfig &&
                        <Button
                            onClick={() => {
                                setActiveCategory(activeCategoryEnum.lb);
                                setDescription(leftBottomDescription);
                            }}
                        >
                            Add Description
                        </Button>

                    }
                </Grid2>
            </Grid2>
            <Box
                sx={{ border: "solid", borderWidth: "1px" }}
            />
            <Grid2 size={4}
                sx={{ padding: "1em", display: "flex", flexDirection: "column", alignItems: "center" }}
            >
                <Grid2 size={3}>
                    {!isConfig &&
                        <Typography
                            sx={{ width: "100%", ":hover": {cursor: "pointer"} }}
                            variant="h4"
                            onClick={() => {
                                setProductname(rightTop);
                                getDescription(rightTop);
                            }}
                        >
                            {rightTop}
                        </Typography>
                    }
                    {isConfig &&
                        <TextField
                            sx={{display: "flex",flexDirection: "row", justifyContent: "center", input: {textAlign: "center"}}}
                            variant="standard"
                            onChange={e => {
                                setRightTop(e.target.value);
                            }}
                            value={rightTop}
                        />
                    }
                    {isConfig &&
                        <Button
                            onClick={() => {
                                setActiveCategory(activeCategoryEnum.rt);
                                setDescription(rightTopDescription);
                            }}
                        >
                            Add Description
                        </Button>

                    }
                </Grid2>
                <Grid2 size={3}>
                    {!isConfig &&
                        <Typography
                            sx={{ width: "100%", ":hover": {cursor: "pointer"} }}
                            variant="h4"
                            onClick={() => {
                                setProductname(rightMiddle);
                                getDescription(rightMiddle);
                            }}
                        >
                            {rightMiddle}
                        </Typography>
                    }
                    {isConfig &&
                        <TextField
                            sx={{display: "flex",flexDirection: "row", justifyContent: "center", input: {textAlign: "center"}}}
                            variant="standard"
                            onChange={e => {
                                setRightMiddle(e.target.value);
                            }}
                            value={rightMiddle}
                        />
                    }
                    {isConfig &&
                        <Button
                            onClick={() => {
                                setActiveCategory(activeCategoryEnum.rm);
                                setDescription(rightMiddleDescription);
                            }}
                        >
                            Add Description
                        </Button>

                    }
                </Grid2>
                <Grid2 size={3}
                >
                    {!isConfig &&
                        <Typography
                            sx={{ width: "100%", ":hover": {cursor: "pointer"} }}
                            variant="h4"
                            onClick={() => {
                                setProductname(rightBottom);
                                getDescription(rightBottom);
                            }}
                        >
                            {rightBottom}
                        </Typography>
                    }
                    {isConfig &&
                        <TextField
                            sx={{display: "flex",flexDirection: "row", justifyContent: "center", input: {textAlign: "center"}}}
                            variant="standard"
                            onChange={e => {
                                setRightBottom(e.target.value);
                            }}
                            value={rightBottom}
                        />
                    }
                    {isConfig &&
                        <Button
                            onClick={() => {
                                setActiveCategory(activeCategoryEnum.rb);
                                setDescription(rightBottomDescription);
                            }}
                        >
                            Add Description
                        </Button>

                    }
                </Grid2>
            </Grid2>
            <Grid2 size={2}>
            </Grid2>
            {isConfig &&
                <Grid2 size={12}
                    sx={{paddingTop: "2vh"}}
                >
                    <Button
                        variant="contained"
                        onClick={saveChanges}
                    >
                        Save Changes
                    </Button>
                </Grid2>
            }
        </Grid2>
        </Box>
            <DescriptionModal isConfig={isConfig} />

    </>
}

export default Descriptions;