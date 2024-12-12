import { Box, Button, FormControlLabel, FormGroup, Grid2, Modal, Switch, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../Context";


const activeCategoryEnum = {
    none: 0,
    lt: 1,
    lm: 2,
    lb: 3,
    rt: 4,
    rm: 5,
    rb: 6
}

const configTemplate = {
    background: "",
    categories: [
        { name: "Default 1", description: "", url: "" },
        { name: "Default 2", description: "", url: "" },
        { name: "Default 3", description: "", url: "" },
        { name: "Default 4", description: "", url: "" },
        { name: "Default 5", description: "", url: "" },
        { name: "Default 6", description: "", url: "" }
    ],
    categoryTitle: "Default Categories",
    imageFiles: [],
    siteTitle: "Default Site Title"
};

export const Descriptions = ({ isConfig }) => {
    const { updateConfigurationAsync, getConfigurationAsync, getBackground } = useContext(ProductContext);
    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [config, setConfig] = useState({});
    const [leftTop, setLeftTop] = useState({name:"Default 1"});
    const [leftMiddle, setLeftMiddle] = useState({name:"Default 2"});
    const [leftBottom, setLeftBottom] = useState({name:"Default 3"});
    const [rightTop, setRightTop] = useState({name:"Default 4"});
    const [rightMiddle, setRightMiddle] = useState({name:"Default 5"});
    const [rightBottom, setRightBottom] = useState({name:"Default 6"});
    const [productName, setProductname] = useState("");
    const [activeCategory, setActiveCategory] = useState(activeCategoryEnum.none);
    const [background, setBackground] = useState({});

    const descriptionApi = axios.create({
        baseURL: `/Site`
    });

    useEffect(() => {
        getConfigurationAsync(figs => {
            getBackground(im => {
                getBackground(async backgrnd => {
                    if (backgrnd) {
                        let img = await fetch(window.atob(backgrnd.image));
                        let blob = await img.blob();
                        let url = URL.createObjectURL(blob);
                        setBackground(url);
                    }
                    setConfig(figs);
                    setTitle(isGood(figs.categoryTitle, configTemplate.categoryTitle));
                    setLeftTop(isGood(figs.categories[0], configTemplate.categories[0]));
                    setLeftMiddle(isGood(figs.categories[1], configTemplate.categories[1]));
                    setLeftBottom(isGood(figs.categories[2], configTemplate.categories[2]));
                    setRightTop(isGood(figs.categories[3], configTemplate.categories[3]));
                    setRightMiddle(isGood(figs.categories[4], configTemplate.categories[4]));
                    setRightBottom(isGood(figs.categories[5], configTemplate.categories[5]));
                });
            });
        })
    }, []);

    const isGood = (test, against) => {
        if (typeof against === "string")
            switch (test) {
                case undefined:
                case null:
                case "":
                    return against;
                default:
                    return test;
            }
        else
            if (typeof against === "object")
                if(test)
                    switch (test.name) {
                        case undefined:
                        case null:
                        case "":
                            return against;
                        default:
                            return test;
                    }
                return against;
    }

    const handleClose = () => {
        setOpen(false);
    }

    const getDescriptionAsync = (product) => {
        descriptionApi.get(product)
            .then(yup => {
                let reggy1 = new RegExp("(?=<sup)(.*?)(?<=>)|(<a)(.*?)(?<=>)|(</a>)|(&#91)(.*?)(?<=&#93)", "g");
                let reggy2 = new RegExp(">;", "g");
                let reggied = yup.data.replace(reggy1, "");
                let final = reggied.replace(reggy2, ',');
                setDescription(`<div>${final}</div>`);
            })
            .catch(nope => console.error(nope));
    }

    const saveChanges = async () => {
        config.categories[0] = leftTop;
        config.categories[1] = leftMiddle;
        config.categories[2] = leftBottom;
        config.categories[3] = rightTop;
        config.categories[4] = rightMiddle;
        config.categories[5] = rightBottom;
        config.categoryTitle = title;
        console.log("save changes: ", config);
        await updateConfigurationAsync(config, cb => {
            console.log("after updating config: ", cb);
        })
    }

    const DescriptionModal = ({ isConfig }) => {
        if (activeCategory === activeCategoryEnum.none) return;
        const [isUrl, setIsUrl] = useState(false);
        const [ltd, setLtd] = useState(config.categories[0].description);
        const [lmd, setLmd] = useState(config.categories[1].description);
        const [lbd, setLbd] = useState(config.categories[2].description);
        const [rtd, setRtd] = useState(config.categories[3].description);
        const [rmd, setRmd] = useState(config.categories[4].description);
        const [rbd, setRbd] = useState(config.categories[5].description);
        const [ltu, setLtu] = useState(config.categories[0].url);
        const [lmu, setLmu] = useState(config.categories[1].url);
        const [lbu, setLbu] = useState(config.categories[2].url);
        const [rtu, setRtu] = useState(config.categories[3].url);
        const [rmu, setRmu] = useState(config.categories[4].url);
        const [rbu, setRbu] = useState(config.categories[5].url);

        const saveDescription = (cb) => {
            config.categories[0].description = ltd;
            config.categories[1].description = lmd;
            config.categories[2].description = lbd;
            config.categories[3].description = rtd;
            config.categories[4].description = rmd;
            config.categories[5].description = rbd;
            config.categories[0].url = ltu;
            config.categories[1].url = lmu;
            config.categories[2].url = lbu;
            config.categories[3].url = rtu;
            config.categories[4].url = rmu;
            config.categories[5].url = rbu;
            cb();
        }

        return <>
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
                            {description !== "" && <div dangerouslySetInnerHTML={{ __html: description }} />}
                            <br />
                            <Typography>
                                This description brought to you by Wikipedia.
                            </Typography>
                        </Box>
                    }
                    {isConfig &&
                        <Box
                            sx={{ width: "40vw", height: "80vh", border: "solid", padding: "2vw", margin: "auto", marginTop: "10vh", background: "tan", display: "flex", flexDirection: "column" }}
                        >
                            <Grid2
                                size={4}
                                sx={{ display: "flex", flexDirection: "row", width: "25vw", marginLeft: "10vw", marginRight: "auto" }}
                            >
                                <Typography
                                    sx={{ margin: "auto", padding: "auto" }}
                                >
                                    Typed Description
                                </Typography>
                                <Switch
                                    onClick={() => setIsUrl(!isUrl)}
                                />
                                <Typography
                                    sx={{ margin: "auto", padding: "auto" }}
                                >
                                    URL
                                </Typography>
                            </Grid2>
                            {isUrl &&
                                <>
                                    {
                                        activeCategory === activeCategoryEnum.lt &&
                                        <TextField
                                            label="URL"
                                            onChange={e => setLtu(e.target.value)}
                                            value={ltu}
                                        />
                                    }
                                    {
                                        activeCategory === activeCategoryEnum.lm &&
                                        <TextField
                                            label="URL"
                                            onChange={e => setLmu(e.target.value)}
                                            value={lmu}
                                        />
                                    }
                                    {
                                        activeCategory === activeCategoryEnum.lb &&
                                        <TextField
                                            label="URL"
                                            onChange={e => setLbu(e.target.value)}
                                            value={lbu}
                                        />
                                    }{
                                        activeCategory === activeCategoryEnum.rt &&
                                        <TextField
                                            label="URL"
                                            onChange={e => setRtu(e.target.value)}
                                            value={rtu}
                                        />
                                    }{
                                        activeCategory === activeCategoryEnum.rm &&
                                        <TextField
                                            label="URL"
                                            onChange={e => setRmu(e.target.value)}
                                            value={rmu}
                                        />
                                    }{
                                        activeCategory === activeCategoryEnum.rb &&
                                        <TextField
                                            label="URL"
                                            onChange={e => setRbu(e.target.value)}
                                            value={rbu}
                                        />
                                    }
                                </>
                            }
                            {
                                !isUrl &&
                                <>
                                    {
                                        activeCategory === activeCategoryEnum.lt &&
                                        <TextField
                                            label="Description"
                                            onChange={d => {
                                                setLtd(d.target.value);
                                            }}
                                            value={ltd}
                                        />
                                    }
                                    {
                                        activeCategory === activeCategoryEnum.lm &&
                                        <TextField
                                            label="Description"
                                            onChange={d => {
                                                setLmd(d.target.value);
                                            }}
                                            value={lmd}
                                        />
                                    }
                                    {
                                        activeCategory === activeCategoryEnum.lb &&
                                        <TextField
                                            label="Description"
                                            onChange={d => {
                                                setLbd(d.target.value);
                                            }}
                                            value={lbd}
                                        />
                                    }
                                    {
                                        activeCategory === activeCategoryEnum.rt &&
                                        <TextField
                                            label="Description"
                                            onChange={d => {
                                                setRtd(d.target.value);
                                            }}
                                            value={rtd}
                                        />
                                    }
                                    {
                                        activeCategory === activeCategoryEnum.rm &&
                                        <TextField
                                            label="Description"
                                            onChange={d => {
                                                setRmd(d.target.value);
                                            }}
                                            value={rmd}
                                        />
                                    }
                                    {
                                        activeCategory === activeCategoryEnum.rb &&
                                        <TextField
                                            label="Description"
                                            onChange={d => {
                                                setRbd(d.target.value);
                                            }}
                                            value={rbd}
                                        />
                                    }
                                </>
                            }
                            <Button
                                onClick={() => {
                                    saveDescription(() => {
                                        setOpen(false);
                                    });
                                }}
                            >
                                Save Description
                            </Button>
                        </Box>
                    }
                </>
            </Modal>
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
                color: "black"
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
                    sx={{ display: "flex", flexDirection: "row", justifyContent: "center", textAlign: "center", input: { textAlign: "center" } }}
                    variant="standard"
                    onChange={e => {
                        setTitle(e.target.value);
                    }}
                    value={title}
                />
            }
            <Grid2 container size={12}
                sx={{ display: "flex" }}
            >
                <Grid2 size={2}>
                </Grid2>
                <Grid2 size={4}
                    sx={{ padding: "1em", display: "flex", flexDirection: "column", alignItems: "center" }}
                >
                    <Grid2 size={3}>
                        {!isConfig &&
                            <Typography
                                sx={{ width: "100%", ":hover": { cursor: "pointer" } }}
                                variant="h4"
                                onClick={() => {
                                    setProductname(leftTop.name);
                                    getDescriptionAsync(leftTop);
                                }}
                            >
                                {leftTop && leftTop.name}
                            </Typography>
                        }
                        {
                            isConfig &&
                            <TextField
                                sx={{ display: "flex", flexDirection: "row", justifyContent: "center", input: { textAlign: "center" } }}
                                variant="standard"
                                onChange={e => {
                                    setLeftTop({ ...leftTop, name: e.target.value });
                                }}
                                value={leftTop.name}
                            />
                        }
                        {isConfig &&
                            <Button
                                onClick={() => {
                                    setActiveCategory(activeCategoryEnum.lt);
                                    setDescription(leftTop.description);
                                    setOpen(true);
                                }}
                            >
                                Add Description
                            </Button>

                        }
                    </Grid2>
                    <Grid2 size={3}>
                        {!isConfig &&
                            <Typography
                                sx={{ width: "100%", ":hover": { cursor: "pointer" } }}
                                variant="h4"
                                onClick={() => {
                                    setProductname(leftMiddle.name);
                                    getDescriptionAsync(leftMiddle);
                                }}
                            >
                                {leftMiddle && leftMiddle.name}
                            </Typography>
                        }
                        {isConfig &&
                            <TextField
                                sx={{ display: "flex", flexDirection: "row", justifyContent: "center", input: { textAlign: "center" } }}
                                variant="standard"
                                onChange={e => {
                                    setLeftMiddle({ ...leftMiddle, name: e.target.value });
                                }}
                                value={leftMiddle.name}
                            />
                        }
                        {isConfig &&
                            <Button
                                onClick={() => {
                                    setActiveCategory(activeCategoryEnum.lm);
                                    setDescription(leftMiddle.description);
                                    setOpen(true);
                                }}
                            >
                                Add Description
                            </Button>

                        }
                    </Grid2>
                    <Grid2 size={3}>
                        {!isConfig &&
                            <Typography
                                sx={{ width: "100%", ":hover": { cursor: "pointer" } }}
                                variant="h4"
                                onClick={() => {
                                    setProductname(leftBottom.name);
                                    getDescriptionAsync(leftBottom);
                                }}
                            >
                                {leftBottom && leftBottom.name}
                            </Typography>
                        }
                        {isConfig &&
                            <TextField
                                sx={{ display: "flex", flexDirection: "row", justifyContent: "center", input: { textAlign: "center" } }}
                                variant="standard"
                                onChange={e => {
                                    setLeftBottom({ ...leftBottom, name: e.target.value });
                                }}
                                value={leftBottom.name}
                            />
                        }
                        {isConfig &&
                            <Button
                                onClick={() => {
                                    setActiveCategory(activeCategoryEnum.lb);
                                    setDescription(leftBottom.description);
                                    setOpen(true);
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
                                sx={{ width: "100%", ":hover": { cursor: "pointer" } }}
                                variant="h4"
                                onClick={() => {
                                    setProductname(rightTop.name);
                                    getDescriptionAsync(rightTop);
                                }}
                            >
                                {rightTop && rightTop.name}
                            </Typography>
                        }
                        {isConfig &&
                            <TextField
                                sx={{ display: "flex", flexDirection: "row", justifyContent: "center", input: { textAlign: "center" } }}
                                variant="standard"
                                onChange={e => {
                                    setRightTop({ ...rightTop, name: e.target.value });
                                }}
                                value={rightTop.name}
                            />
                        }
                        {isConfig &&
                            <Button
                                onClick={() => {
                                    setActiveCategory(activeCategoryEnum.rt);
                                    setDescription(rightTop.description);
                                    setOpen(true);
                                }}
                            >
                                Add Description
                            </Button>

                        }
                    </Grid2>
                    <Grid2 size={3}>
                        {!isConfig &&
                            <Typography
                                sx={{ width: "100%", ":hover": { cursor: "pointer" } }}
                                variant="h4"
                                onClick={() => {
                                    setProductname(rightMiddle.name);
                                    getDescriptionAsync(rightMiddle);
                                }}
                            >
                                {rightMiddle && rightMiddle.name}
                            </Typography>
                        }
                        {isConfig &&
                            <TextField
                                sx={{ display: "flex", flexDirection: "row", justifyContent: "center", input: { textAlign: "center" } }}
                                variant="standard"
                                onChange={e => {
                                    setRightMiddle({ ...rightMiddle, name: e.target.value });
                                }}
                                value={rightMiddle.name}
                            />
                        }
                        {isConfig &&
                            <Button
                                onClick={() => {
                                    setActiveCategory(activeCategoryEnum.rm);
                                    setDescription(rightMiddle.description);
                                    setOpen(true);
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
                                sx={{ width: "100%", ":hover": { cursor: "pointer" } }}
                                variant="h4"
                                onClick={() => {
                                    setProductname(rightBottom.name);
                                    getDescriptionAsync(rightBottom);
                                }}
                            >
                                {rightBottom && rightBottom.name}
                            </Typography>
                        }
                        {isConfig &&
                            <TextField
                                sx={{ display: "flex", flexDirection: "row", justifyContent: "center", input: { textAlign: "center" } }}
                                variant="standard"
                                onChange={e => {
                                    setRightBottom({ ...rightBottom, name: e.target.value });
                                }}
                                value={rightBottom.name}
                            />
                        }
                        {isConfig &&
                            <Button
                                onClick={() => {
                                    setActiveCategory(activeCategoryEnum.rb);
                                    setDescription(rightBottom.description);
                                    setOpen(true);
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
                    >
                        <Button
                            sx={{ width: "100%" }}
                            variant="contained"
                            onClick={saveChanges}
                        >
                            Save Changes
                        </Button>
                    </Grid2>
                }
            </Grid2>
        </Box>
        <DescriptionModal
            isConfig={isConfig}
        />

    </>
}

export default Descriptions;