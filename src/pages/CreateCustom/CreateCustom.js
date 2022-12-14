import React, { useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Container,
  createTheme,
  CssBaseline,
  FormControlLabel,
  Grid,
  Switch,
  ThemeProvider,
} from '@mui/material';
import { themeOptions } from '../../utils/ThemeOptions';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router-dom';
import { CenterDivider } from '../../components/StyledMui/CenterDivider';
import { getRequest } from '../../utils/RequestUtils';
import { useAuth } from '../../utils/Authenticate';
import { useEffect } from 'react';
import { createGroup, createEatAtOffice } from '../../utils/Groups';

const theme = createTheme(themeOptions);
const date = new Date();
const getTime = () => {
  let hour = date.getHours();
  let minutes = date.getMinutes();
  // dayjs(new Date()).hour(23).minute(59).second(59).millisecond(99)
  if (hour === 23 && minutes > 45)
    return {
      minTime: dayjs(date).hour(0).minute(0).second(0).millisecond(0),
      maxTime: dayjs(date).hour(0).minute(0).second(0).millisecond(0),
    };
  else if (minutes > 45) {
    minutes = 0;
    hour += 1;
  } else if (minutes > 30) {
    minutes = 45;
  } else if (minutes > 15) {
    minutes = 30;
  } else if (minutes > 0) {
    minutes = 15;
  } else {
    minutes = 0;
  }

  return {
    minTime: dayjs(date).hour(hour).minute(minutes).second(0).millisecond(0),
    maxTime: dayjs(date).hour(23).minute(59).second(0).millisecond(0),
  };
};
const { minTime, maxTime } = getTime();
const pickerOptions = {
  //maxTime +1m but < step - AK
  minTime,
  maxTime,
  minStep: 15,
};

const CreateCustom = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tValue, tSetValue] = useState(minTime);
  const [autoValue, setAutoValue] = useState('Restaurant');
  const [restaurants, setRestaurants] = useState();
  const [eatAtOffice, setEatAtOffice] = useState(false);
  const [error, setError] = useState(false);

  // handle autocomplete change to get value
  const handleAutoChange = (event, value) => setAutoValue(value);

  //handle slider change
  const handleSliderChange = (event, newValue) => {
    let newDate = dayjs(new Date())
      .hour(0)
      .minute(newValue)
      .second(0)
      .millisecond(0);
    tSetValue(newDate);
  };

  //handle time change
  const handleTimerChange = (newValue) => {
    let newDate = dayjs(newValue).second(0).millisecond(0);
    const mins = newDate.minute() + newDate.hour() * 60;
    tSetValue(newDate);
    handleSliderChange(null, mins);
  };

  // currently, printing time and restaurant on console
  const handleOk = async () => {
    if (eatAtOffice) {
      await createEatAtOffice(tValue).then(() => {
        navigate('/main');
      });

      // custom restaurant choices
      if (autoValue === 'Restaurant') {
        return;
      }
    }
    await createGroup(autoValue['id'], tValue).then(() => {
      navigate('/main');
    });
  };

  const pickForMe = () => {
    const size = restaurants.length;
    const randInt = Math.floor(Math.random() * size);
    const restaurant = restaurants[randInt];
    setAutoValue(restaurant);
  };

  useEffect(() => {
    if (!restaurants) {
      getRequest('/get-restaurant-list-office', String(user)).then(
        (resJSON) => {
          if (resJSON) {
            let data = [];
            resJSON['data'].map((value) => {
              let restaurant = {
                label: value['name'],
                id: value['id'],
              };
              data.push(restaurant);
              return true;
            });
            setRestaurants(data);
          }
        }
      );
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container component='main' maxWidth='xs'>
          <CssBaseline />
          <Box
            sx={{
              marginTop: 2,
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant={'h6'} textAlign={'center'} marginBottom={2}>
              Please set the start time of your lunch
            </Typography>
            <Grid container spacing={3} justifyContent={'center'}>
              <Grid item alignItems={'center'} xs={6}>
                <TimePicker
                  closeOnSelect={true}
                  minutesStep={pickerOptions.minStep}
                  ampm={false}
                  value={tValue}
                  onError={(reason) => {
                    setError(!!reason);
                  }}
                  onChange={handleTimerChange}
                  minTime={pickerOptions.minTime}
                  maxTime={pickerOptions.maxTime}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className='timePicker'
                      label={'At'}
                      sx={{
                        svg: {
                          color: '#ffffff',
                        },
                        input: {
                          textAlign: 'center',
                          color: '#ffffff',
                        },
                      }}
                    />
                  )}
                  sx={{ backgroundColor: '#00173a' }}
                />
              </Grid>

              <Grid item alignItems={'center'} xs={8}>
                {/* <Slider
                  sx={{ marginTop: 2 }}
                  id='timeSlider'
                  value={sliderValue}
                  defaultValue={1100}
                  track={false}
                  getAriaValueText={valuetext}
                  onChange={handleSliderChange}
                  step={sliderOptions.minStep}
                  valueLabelDisplay='off'
                  marks={marks}
                  min={sliderOptions.minTime}
                  max={sliderOptions.maxTime}
                /> */}
              </Grid>
            </Grid>
            <CenterDivider />

            <Grid container spacing={0} justifyContent={'center'}>
              <FormControlLabel
                id='eatAtOffice'
                control={
                  <Switch
                    onChange={() => setEatAtOffice(!eatAtOffice)}
                    value='atOffice'
                  />
                }
                color='objective'
                label='Eat at office?'
                labelPlacement={'start'}
              />
              {restaurants && !eatAtOffice && (
                <>
                  <Typography
                    variant={'h6'}
                    textAlign={'center'}
                    marginBottom={2}
                  >
                    {' '}
                    Please Choose a restaurant
                  </Typography>
                  <Autocomplete
                    disabled={eatAtOffice}
                    disablePortal
                    variant={'outlined'}
                    id='restaurantBar'
                    value={autoValue}
                    options={restaurants}
                    getOptionDisabled={(option) => option === autoValue}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    /* Currently, value on console */
                    onChange={handleAutoChange}
                    sx={{
                      width: 320,
                      svg: {
                        color: '#ffffff',
                      },
                      input: {
                        color: '#ffffff',
                      },
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label='Restaurant' />
                    )}
                  />
                </>
              )}
            </Grid>

            {restaurants && !eatAtOffice && (
              <Grid item align='center'>
                <Button
                  disabled={eatAtOffice}
                  onClick={pickForMe}
                  sx={{ marginTop: 2 }}
                >
                  {' '}
                  Pick for me
                </Button>
              </Grid>
            )}

            <CenterDivider />

            <Grid container spacing={1} align='center' direction='row'>
              <Grid item xs={6}>
                <Button
                  disabled={
                    tValue < minTime ||
                    (autoValue === 'Restaurant' && !eatAtOffice) ||
                    error
                  }
                  style={{ minWidth: 100 }}
                  id={'okButton'}
                  onClick={handleOk}
                  //component={Link} to="/main"
                >
                  {' '}
                  Ok
                </Button>
              </Grid>

              <Grid item xs={6}>
                <Button
                  style={{ minWidth: 100 }}
                  id={'cancelButton'}
                  component={Link}
                  to='/main'
                >
                  {' '}
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default CreateCustom;
