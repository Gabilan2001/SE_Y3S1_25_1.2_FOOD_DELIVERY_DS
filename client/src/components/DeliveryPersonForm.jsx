import React, { useState } from 'react';
import {
  Modal,
  TextInput,
  Stack,
  Group,
  Button,
  Select,
  FileInput,
  Text,
  NumberInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import {
  IconUser,
  IconPhone,
  IconMail,
  IconMapPin,
  IconId,
  IconBike,
  IconLicense,
  IconUpload
} from '@tabler/icons-react';

const DeliveryPersonForm = ({ opened, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      vehicleType: '',
      vehicleNumber: '',
      age: 18,
      profileImage: null,
      idProof: null,
      vehicleLicense: null,
    },
    validate: {
      name: (value) => (!value ? 'Name is required' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phone: (value) => (value.length < 10 ? 'Invalid phone number' : null),
      address: (value) => (!value ? 'Address is required' : null),
      vehicleType: (value) => (!value ? 'Vehicle type is required' : null),
      vehicleNumber: (value) => (!value ? 'Vehicle number is required' : null),
      age: (value) => (value < 18 ? 'Must be at least 18 years old' : null),
      profileImage: (value) => (!value ? 'Profile image is required' : null),
      idProof: (value) => (!value ? 'ID proof is required' : null),
      vehicleLicense: (value) => (!value ? 'Vehicle license is required' : null),
    },
  });

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Append all text fields
      Object.keys(values).forEach(key => {
        if (key !== 'profileImage' && key !== 'idProof' && key !== 'vehicleLicense') {
          formData.append(key, values[key]);
        }
      });

      // Append files
      formData.append('profileImage', values.profileImage);
      formData.append('idProof', values.idProof);
      formData.append('vehicleLicense', values.vehicleLicense);

      const response = await axios.post('/api/delivery-boys/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showNotification({
        title: 'Success',
        message: 'Delivery person registered successfully',
        color: 'green',
      });

      onSuccess(response.data);
      onClose();
      form.reset();
    } catch (error) {
      showNotification({
        title: 'Error',
        message: error.response?.data?.message || 'Registration failed',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text size="lg" weight={700}>Add New Delivery Person</Text>}
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="md">
          <TextInput
            required
            label="Full Name"
            placeholder="Enter full name"
            icon={<IconUser size={16} />}
            {...form.getInputProps('name')}
          />

          <Group grow>
            <TextInput
              required
              label="Email"
              placeholder="email@example.com"
              icon={<IconMail size={16} />}
              {...form.getInputProps('email')}
            />
            <TextInput
              required
              label="Phone"
              placeholder="Enter phone number"
              icon={<IconPhone size={16} />}
              {...form.getInputProps('phone')}
            />
          </Group>

          <TextInput
            required
            label="Address"
            placeholder="Enter full address"
            icon={<IconMapPin size={16} />}
            {...form.getInputProps('address')}
          />

          <Group grow>
            <Select
              required
              label="Vehicle Type"
              placeholder="Select vehicle type"
              icon={<IconBike size={16} />}
              data={[
                { value: 'Motorcycle', label: 'Motorcycle' },
                { value: 'Scooter', label: 'Scooter' },
                { value: 'Bicycle', label: 'Bicycle' },
                { value: 'Electric Bike', label: 'Electric Bike' },
              ]}
              {...form.getInputProps('vehicleType')}
            />
            <TextInput
              required
              label="Vehicle Number"
              placeholder="Enter vehicle number"
              icon={<IconId size={16} />}
              {...form.getInputProps('vehicleNumber')}
            />
          </Group>

          <NumberInput
            required
            label="Age"
            placeholder="Enter age"
            min={18}
            max={65}
            {...form.getInputProps('age')}
          />

          <FileInput
            required
            label="Profile Image"
            placeholder="Upload profile image"
            icon={<IconUpload size={16} />}
            accept="image/*"
            {...form.getInputProps('profileImage')}
          />

          <Group grow>
            <FileInput
              required
              label="ID Proof"
              placeholder="Upload ID proof"
              icon={<IconId size={16} />}
              accept=".pdf,image/*"
              {...form.getInputProps('idProof')}
            />
            <FileInput
              required
              label="Vehicle License"
              placeholder="Upload license"
              icon={<IconLicense size={16} />}
              accept=".pdf,image/*"
              {...form.getInputProps('vehicleLicense')}
            />
          </Group>

          <Group position="right" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Register
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default DeliveryPersonForm; 