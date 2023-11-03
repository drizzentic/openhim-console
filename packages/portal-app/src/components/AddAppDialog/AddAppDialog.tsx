import {useState} from 'react'
import ReactDOM from 'react-dom'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import Alert from '@mui/material/Alert'
import {Box, Stack} from '@mui/material'
import {useTheme, styled} from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import {useForm, FormProvider} from 'react-hook-form'
import {registerNewApp} from '../../utils/apiClient'
import FormFields from '../FormFields/FormFields'
import AlertSection from '../AlertSection/AlertSection'

const BootstrapDialog = styled(Dialog)(({theme}) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}))

const AddNewAppDialog = ({apps, setApps}) => {
  /**
   * Determines whether the AddAppDialog should be set to full screen mode or not based on the current breakpoint.
   * @returns {boolean} A boolean value indicating whether the screen is in full screen mode or not.
   */
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const [open, setOpen] = useState(false)
  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const [alertState, setAlertState] = useState(null)

  const FormInitialState = {
    name: '',
    description: '',
    icon: '',
    type: '',
    category: '',
    url: '',
    showInPortal: true,
    showInSideBar: false
  }
  const [appData, setAppData] = useState(FormInitialState)

  const addNewApp = async appData => {
    try {
      const newApp = await registerNewApp(appData)
      setApps([...apps, newApp])
      setAlertState(null)
      const SuccessMessage = (
        <Box paddingBottom={5}>
          <Alert severity="success">App was registered successfully</Alert>
        </Box>
      )
      ReactDOM.render(SuccessMessage, document.getElementById('alertSection'))
      setOpen(false)
      setAppData(FormInitialState)
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error.includes('E11000')
      ) {
        setAlertState({
          severity: 'error',
          message: 'App already exists'
        })
      } else {
        setAlertState({
          severity: 'error',
          message: 'Failed to add app. Please try again.'
        })
      }
    }
  }

  const methods = useForm({
    defaultValues: FormInitialState
  })
  const onSubmit = data => {
    addNewApp(data)
  }

  return (
    <div>
      <IconButton aria-label="add app" onClick={handleClickOpen}>
        <AddIcon />
      </IconButton>
      <BootstrapDialog
        onClose={handleClose}
        open={open}
        color="#1976d21a"
        aria-labelledby="customized-dialog-title"
        fullScreen={fullScreen}
      >
        <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
          <Typography align="center" variant="h5">
            Add Portal Item
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Use the form below to add your portal item.
          </Typography>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.text.primary
          }}
        >
          <CloseIcon />
        </IconButton>
        {alertState && <AlertSection {...alertState} />}
        <DialogContent dividers>
          <FormProvider {...methods}>
            <form id="AddNewAppForm" onSubmit={methods.handleSubmit(onSubmit)}>
              <Stack spacing={2} minWidth={538}>
                <FormFields />
              </Stack>
            </form>
          </FormProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button form="AddNewAppForm" type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  )
}

export default AddNewAppDialog
