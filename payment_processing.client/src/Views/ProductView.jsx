import react, { useCallback, useContext, useEffect, useState } from "react";
import axios from 'axios';
import NewProduct from "./NewProduct";
import { AccountContext, ProductContext } from "../Context";
import BathtubIcon from '@mui/icons-material/Bathtub';
import { Input } from '@mui/base/Input';

import { Box, Grid2 } from "@mui/material";


const productVeiwEnum = {
    home: 0,
    all: 1,
    new: 2
};

export const ProductView = () => {


    return <div>
        <div>
            Product View
        </div>

    </div>
}

export const NewProductForm = (product,attributes,setAttributes) => {

    return (
        <Box
            sx={{}}
        >
            <Grid2 size={12}
            >
                <Grid2 size={4}
                >
                    <BathtubIcon />
                </Grid2>
                <Grid2 size={8}
                >
                    <Box>
                        <Input minRows={3}/>
                    </Box>
                </Grid2>
            </Grid2>
        </Box>
    )
}

// export default {
//     ProductView,
//     NewProductForm
// };