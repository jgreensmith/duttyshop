import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Store } from '../Store';
import getCommerce from '../../utils/commerce';

const dev = process.env.NODE_ENV === 'development';


const StepTwo = (props) => {

    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const [checkoutToken, setCheckoutToken] = useState();

    useEffect(() => {
        if (!cart.loading) {
          generateCheckoutToken();
        }
      }, [cart.loading]);
    
      const generateCheckoutToken = async () => {
        if (cart.data.line_items.length) {
          const commerce = getCommerce(props.commercePublicKey);
          const token = await commerce.checkout.generateToken(cart.data.id, {
            type: 'cart',
          });
          console.log({token})
          setCheckoutToken(token);
          fetchShippingCountries(token.id);

        } else {
          Router.push('/cart');
        }
      };
    
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
        dev ? '' : ''
    );
    const [shippingCountry, setShippingCountry] = useState(dev ? 'GB' : '');
    const [shippingOption, setShippingOption] = useState({});

    // Shipping and fulfillment data
    const [shippingCountries, setShippingCountries] = useState({});
    const [shippingSubdivisions, setShippingSubdivisions] = useState({});
    const [shippingOptions, setShippingOptions] = useState([]);
                
    const handleShippingCountryChange = (e) => {
        const currentValue = e.target.value;
        setShippingCountry(e.target.value);
        fetchSubdivisions(currentValue);
    };

    const fetchShippingCountries = async (checkoutTokenId) => {
        const commerce = getCommerce(props.commercePublicKey);
        const countries = await commerce.services.localeListShippingCountries(
          checkoutTokenId
        );
        setShippingCountries(countries.countries);
    };
    const fetchSubdivisions = async (countryCode) => {
        const commerce = getCommerce(props.commercePublicKey);
        const subdivisions = await commerce.services.localeListSubdivisions(
          countryCode
        );
        setShippingSubdivisions(subdivisions.subdivisions);
    };
                
    const handleSubdivisionChange = (e) => {
        const currentValue = e.target.value;
        setShippingStateProvince(currentValue);
        fetchShippingOptions(checkoutToken.id, shippingCountry, currentValue);
    };
                
    const handleShippingOptionChange = (e) => {
        const currentValue = e.target.value;
        setShippingOption(currentValue);
        console.log(currentValue);
    };

    const fetchShippingOptions = async (
        checkoutTokenId,
        country,
        stateProvince = null
      ) => {
        const commerce = getCommerce(props.commercePublicKey);
        const options = await commerce.checkout.getShippingOptions(
          checkoutTokenId,
          {
            country: country,
            region: stateProvince,
          }
        );
        setShippingOptions(options);
        const shippingOption = options[0] ? options[0].id : null;
        setShippingOption(shippingOption);
    };            

    return (
        <>
        <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="shippingName"
        label="Full Name"
        name="name"
        value={shippingName}
        onChange={(e) => setShippingName(e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="shippingStreet"
        label="Street"
        name="address"
        value={shippingStreet}
        onChange={(e) => setShippingStreet(e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="shippingCity"
        label="City"
        name="city"
        value={shippingCity}
        onChange={(e) => setShippingCity(e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="shippingPostalZipCode"
        label="Postal/Zip Code"
        name="postalCode"
        value={shippingPostalZipCode}
        onChange={(e) => setShippingPostalZipCode(e.target.value)}
      />
      <FormControl sx={{ 
            margin: 1,
            minWidth: 120,
            width: '100%', 
            }}>
        <InputLabel id="shippingCountry-label">Country</InputLabel>
        <Select
          labelId="shippingCountry-label"
          id="shippingCountry"
          label="Country"
          fullWidth
          onChange={handleShippingCountryChange}
          value={shippingCountry}
        >
          {Object.keys(shippingCountries).map((index) => (
            <MenuItem value={index} key={index}>
              {shippingCountries[index]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ 
            margin: 1,
            minWidth: 120,
            width: '100%', 
        }}>
        <InputLabel id="shippingStateProvince-label">
          Region/ State 
        </InputLabel>

        <Select
          labelId="shippingStateProvince-label"
          id="shippingStateProvince"
          label="State/Province"
          fullWidth
          onChange={handleSubdivisionChange}
          value={shippingStateProvince}
          required
        >
          {Object.keys(shippingSubdivisions).map((index) => (
            <MenuItem value={index} key={index}>
              {shippingSubdivisions[index]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ 
            margin: 1,
            minWidth: 120,
            width: '100%', 
            }}>
        <InputLabel id="shippingOption-label">Shipping Option</InputLabel>

        <Select
            labelId="shippingOption-label"
            id="shippingOption"
            label="Shipping Option"
            fullWidth
            onChange={handleShippingOptionChange}
            value={shippingOption}
            required
        >
          {shippingOptions.map((method, index) => (
            <MenuItem
              value={method.id}
              key={index}
            >{`${method.description} - $${method.price.formatted_with_code}`}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
    )
}

export default dynamic(() => Promise.resolve(StepTwo), {
    ssr: false,
});
