import { 
    Alert, 
    Button, 
    Card, 
    CardActionArea, 
    CardContent, 
    CardMedia, 
    CircularProgress, 
    Grid, 
    List, 
    ListItem, 
    MenuItem, 
    Select, 
    Slide, 
    Step, 
    StepLabel, 
    Stepper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    TextField, 
    Typography 
} from '@mui/material';
import dynamic from 'next/dynamic';
import { Box } from '@mui/system';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Store } from '../components/Store';
import styles from '../styles/Home.module.css'
import getCommerce from '../utils/commerce'
import { CART_RETRIEVE_SUCCESS } from '../utils/constants';
import StepOne from '../components/Steps/StepOne';
import StepTwo from '../components/Steps/StepTwo';
import StepThree from '../components/Steps/StepThree';


const dev = process.env.NODE_ENV === 'development';

function Checkout(props) {
    const { state, dispatch } = useContext(Store);
    const { cart } = state;


    // Customer details
    const [firstName, setFirstName] = useState(dev ? 'Jane' : '');
    const [lastName, setLastName] = useState(dev ? 'Doe' : '');
    const [email, setEmail] = useState(dev ? 'janedoe@email.com' : '');

    // Shipping details
    const [shippingName, setShippingName] = useState(dev ? 'Jane Doe' : '');
    const [shippingStreet, setShippingStreet] = useState(
        dev ? '123 Fake St' : ''
    );
    const [shippingPostalZipCode, setShippingPostalZipCode] = useState(
        dev ? '90089' : ''
    );
    const [shippingCity, setShippingCity] = useState(dev ? 'Los Angeles' : '');
    const [shippingStateProvince, setShippingStateProvince] = useState(
        dev ? 'AR' : ''
    );
    const [shippingCountry, setShippingCountry] = useState(dev ? 'GB' : '');
    const [shippingOption, setShippingOption] = useState({});
    // Payment details
    const [cardNum, setCardNum] = useState(dev ? '4242 4242 4242 4242' : '');
    const [expMonth, setExpMonth] = useState(dev ? '11' : '');
    const [expYear, setExpYear] = useState(dev ? '2023' : '');
    const [cvv, setCvv] = useState(dev ? '123' : '');
    const [billingPostalZipcode, setBillingPostalZipcode] = useState(
        dev ? '90089' : ''
    );
    // Shipping and fulfillment data
    const [shippingCountries, setShippingCountries] = useState({});
    const [shippingSubdivisions, setShippingSubdivisions] = useState({});
    const [shippingOptions, setShippingOptions] = useState([]);

    // Stepper
    const [activeStep, setActiveStep] = useState(0);
    const steps = [
        'Customer information',
        'Shipping details',
        'Payment information',
    ];

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

        if (activeStep === steps.length -1) {
            //handleCaptureCheckout();
        }
    };

    const [errors, setErrors] = useState([]);

    const handleBack = () => {
        setErrors([]);
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0: 
                return ( <StepOne /> );
            case 1:
                return ( <StepTwo /> );
            case 2: 
                return (<StepThree /> );
            default:
                return 'Unknown step';
        }
    }

 
    return (
        <Layout title="Checkout" commercePublicKey={props.commercePublicKey}>
             <Typography gutterBottom variant="h6" color="textPrimary" component="h1">
                Checkout
            </Typography>
            {cart.loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={2}>
                    <Grid item md={8}>
                        <Card sx={{ padding: '1rem !important' }}>
                            <form>
                                <Stepper activeStep={activeStep} alternativeLabel>
                                    {steps.map((label) => (
                                        <Step key={label}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                                <Box>
                                    {activeStep === steps.length ? (
                                        errors && errors.length > 0 ? (
                                            <Box>
                                                <List>
                                                {errors.map((error) => (
                                                    <ListItem key={error}>
                                                        <Alert severity="error">{error}</Alert>
                                                    </ListItem>
                                                ))}
                                                </List>
                                                <Box sx={{ margin: '1rem !important' }}>
                                                    <Button
                                                        onClick={handleBack}
                                                    >
                                                        Back
                                                    </Button>
                                                </Box>
                                            </Box>
                                        ) : (
                                        <Box>
                                            <CircularProgress />
                                            <Typography>
                                                Confirming Order...
                                            </Typography>
                                        </Box>
                                        )
                                    ) : (
                                        <Box>
                                            {getStepContent(activeStep)}
                                            <Box sx={{ margin: '1rem !important' }}>
                                                <Button
                                                    disabled={activeStep === 0}
                                                    onClick={handleBack}
                                                >
                                                Back
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleNext}
                                                >
                                                    {activeStep === steps.length - 1
                                                        ? 'Confirm Order'
                                                        : 'Next'}
                                                </Button>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            </form>
                        </Card>
                    </Grid>
                    <Grid item md={4}>
                        <Card>
                            <List>
                                <ListItem>
                                    <Typography variant="h2">Order summary</Typography>
                                </ListItem>
                                {cart.data.line_items.map((lineItem) => (
                                    <ListItem key={lineItem.id}>
                                        <Grid container>
                                            <Grid xs={6} item>
                                                {lineItem.quantity} x {lineItem.name}
                                            </Grid>
                                            <Grid xs={6} item>
                                                <Typography align="right">
                                                    {lineItem.line_total.formatted_with_symbol}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                ))}
                                <ListItem>
                                    <Grid container>
                                        <Grid xs={6} item>
                                            Subtotal
                                        </Grid>
                                        <Grid xs={6} item>
                                            <Typography align="right">
                                                {cart.data.subtotal.formatted_with_symbol}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            </List>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Layout>
    )
}

export default dynamic(() => Promise.resolve(Checkout), {
    ssr: false,
});

