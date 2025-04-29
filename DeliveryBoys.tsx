import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Table,
  Group,
  Button,
  ActionIcon,
  Text,
  Switch,
  Modal,
  TextInput,
  Stack,
  Select,
  Card,
  Image,
  Badge,
  Grid,
  SegmentedControl,
  Avatar,
  LoadingOverlay,
} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus, IconTable, IconGridDots } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import deliveryBoyService, { DeliveryBoy, DeliveryBoyFormData } from '../services/deliveryBoyService';

const DeliveryBoys = () => {
  const navigate = useNavigate();
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [formData, setFormData] = useState<DeliveryBoyFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    vehicleType: '',
    vehicleNumber: '',
    age: 0,
    profileImage: null,
    idProof: null,
    vehicleLicense: null,
  });

  // Fetch delivery boys from backend
  const fetchDeliveryBoys = async () => {
    try {
      setLoading(true);
      const data = await deliveryBoyService.getAll();
      setDeliveryBoys(data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch delivery boys',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Create form data for file upload
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value);
        }
      });

      // Register new delivery person through API
      await deliveryBoyService.register(formData);
      
      notifications.show({
        title: 'Success',
        message: 'Delivery person registered successfully',
        color: 'green',
      });

      setShowForm(false);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        vehicleType: '',
        vehicleNumber: '',
        age: 0,
        profileImage: null,
        idProof: null,
        vehicleLicense: null,
      });
      // Refresh the list
      fetchDeliveryBoys();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to register delivery person',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this delivery person?')) {
      return;
    }

    try {
      setLoading(true);
      await deliveryBoyService.delete(id);
      notifications.show({
        title: 'Success',
        message: 'Delivery person deleted successfully',
        color: 'green',
      });
      // Refresh the list
      fetchDeliveryBoys();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete delivery person',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      setLoading(true);
      await deliveryBoyService.toggleOnlineStatus(id);
      notifications.show({
        title: 'Success',
        message: 'Status updated successfully',
        color: 'green',
      });
      // Refresh the list
      fetchDeliveryBoys();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update status',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof DeliveryBoyFormData) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };

  const renderGridView = () => (
    <Grid>
      {deliveryBoys.map((boy) => (
        <Grid.Col key={boy._id} span={12} sm={6} lg={4}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Card.Section>
              <Image
                src={boy.profileImage}
                height={160}
                alt={boy.name}
                withPlaceholder
              />
            </Card.Section>

            <Group position="apart" mt="md" mb="xs">
              <Text weight={500}>{boy.name}</Text>
              <Badge color={boy.isOnline ? 'green' : 'gray'} variant="light">
                {boy.isOnline ? 'Online' : 'Offline'}
              </Badge>
            </Group>

            <Stack spacing="xs">
              <Text size="sm" color="dimmed">
                📧 {boy.email}
              </Text>
              <Text size="sm" color="dimmed">
                📱 {boy.phone}
              </Text>
              <Text size="sm" color="dimmed">
                🚗 {boy.vehicleType} - {boy.vehicleNumber}
              </Text>
              <Group position="apart">
                <Text size="sm">Rating: {boy.rating.toFixed(1)} ⭐</Text>
                <Text size="sm">Deliveries: {boy.totalDeliveries} 📦</Text>
              </Group>
            </Stack>

            <Group position="apart" mt="md">
              <Button
                variant="light"
                color="blue"
                size="xs"
                onClick={() => navigate(`/delivery-boys/${boy._id}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="light"
                color="red"
                size="xs"
                onClick={() => handleDelete(boy._id)}
              >
                Delete
              </Button>
            </Group>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );

  return (
    <Container size="xl" pos="relative">
      <LoadingOverlay visible={loading} overlayBlur={2} />
      
      <Modal
        opened={showForm}
        onClose={() => setShowForm(false)}
        title="Register New Delivery Person"
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing="md">
            <TextInput
              required
              label="Name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextInput
              required
              label="Email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextInput
              required
              label="Phone"
              placeholder="+1 234-567-8900"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <TextInput
              required
              label="Address"
              placeholder="Enter full address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Select
              required
              label="Vehicle Type"
              placeholder="Select vehicle type"
              value={formData.vehicleType}
              onChange={(value) => setFormData({ ...formData, vehicleType: value || '' })}
              data={[
                { value: 'bike', label: '🏍️ Bike' },
                { value: 'scooter', label: '🛵 Scooter' },
                { value: 'bicycle', label: '🚲 Bicycle' }
              ]}
            />
            <TextInput
              required
              label="Vehicle Number"
              placeholder="Enter vehicle number"
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
            />
            <TextInput
              type="file"
              label="Profile Image"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'profileImage')}
            />
            <TextInput
              type="file"
              label="ID Proof"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileChange(e, 'idProof')}
            />
            <TextInput
              type="file"
              label="Vehicle License"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileChange(e, 'vehicleLicense')}
            />
            <Button type="submit" fullWidth loading={loading}>
              Register Delivery Person
            </Button>
          </Stack>
        </form>
      </Modal>

      <Group position="apart" mb="xl">
        <Title order={2}>Delivery Boys</Title>
        <Group>
          <SegmentedControl
            value={viewMode}
            onChange={(value: 'table' | 'grid') => setViewMode(value)}
            data={[
              { label: 'Grid', value: 'grid', icon: <IconGridDots size={16} /> },
              { label: 'Table', value: 'table', icon: <IconTable size={16} /> },
            ]}
          />
          <Button leftIcon={<IconPlus size={16} />} onClick={() => setShowForm(true)}>
            Add New Delivery Person
          </Button>
        </Group>
      </Group>

      {viewMode === 'grid' ? renderGridView() : (
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Vehicle</th>
              <th>Status</th>
              <th>Rating</th>
              <th>Deliveries</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveryBoys.map((boy) => (
              <tr key={boy._id}>
                <td>{boy.name}</td>
                <td>{boy.email}</td>
                <td>{boy.phone}</td>
                <td>
                  {boy.vehicleType} - {boy.vehicleNumber}
                </td>
                <td>
                  <Switch
                    checked={boy.isOnline}
                    onChange={() => handleToggleStatus(boy._id)}
                    label={boy.isOnline ? 'Online' : 'Offline'}
                  />
                </td>
                <td>{boy.rating.toFixed(1)}</td>
                <td>{boy.totalDeliveries}</td>
                <td>
                  <Group spacing={0} position="left">
                    <ActionIcon
                      onClick={() => navigate(`/delivery-boys/${boy._id}/edit`)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      onClick={() => handleDelete(boy._id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default DeliveryBoys;
