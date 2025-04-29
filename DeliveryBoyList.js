import React, { useEffect, useState } from 'react';
import { Container, Grid, TextInput, Group, Select, Text, Paper } from '@mantine/core';
import { IconSearch, IconFilter } from '@tabler/icons-react';
import DeliveryBoyCard from '../components/DeliveryBoyCard';
import axios from 'axios';

const DeliveryBoyList = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data for testing
  const mockData = [
    { _id: '1', name: 'John Smith', vehicleNumber: 'WP BAC 1234', area: 'Colombo Central', status: 'active', totalDeliveries: 156, rating: 4.8, vehicleType: 'Motorcycle', phone: '+94 71 234 5678', email: 'john.smith@example.com' },
    { _id: '2', name: 'Kumar Perera', vehicleNumber: 'CP XYZ 7880', area: 'Kandy City', status: 'inactive', totalDeliveries: 243, rating: 4.9, vehicleType: 'Three Wheeler', phone: '+94 77 887 6543', email: 'kumar.perera@example.com' },
    { _id: '3', name: 'Samantha Silva', vehicleNumber: 'WP GHI 7890', area: 'Negombo', status: 'active', totalDeliveries: 178, rating: 4.7, vehicleType: 'Motorcycle', phone: '+94 74 444 5555', email: 'samantha@example.com' },
    { _id: '4', name: 'Mohamed Rizwan', vehicleNumber: 'SP DEF 4567', area: 'Galle Fort', status: 'inactive', totalDeliveries: 89, rating: 4.6, vehicleType: 'Scooter', phone: '+94 75 555 1234', email: 'rizwan@example.com' },
  ];

  useEffect(() => {
    // Simulate fetching data from an API and then set it
    setLoading(false);
    setDeliveryBoys(mockData);
  }, []);

  const filteredDeliveryBoys = deliveryBoys.filter(boy => {
    const matchesSearch = boy.name.toLowerCase().includes(search.toLowerCase()) ||
                         boy.vehicleNumber.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'online') return matchesSearch && boy.status === 'active';
    if (filter === 'offline') return matchesSearch && boy.status === 'inactive';
    return matchesSearch;
  });

  return (
    <Paper p="md" radius={0} style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Container size="xl">
        <Group position="apart" mb="xl" mt="md">
          <Text size="xl" weight={700} color="dark">
            Delivery Partners
          </Text>
          <Group spacing="sm">
            <TextInput
              placeholder="Search by name or vehicle number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<IconSearch size={16} />}
              style={{ width: '300px' }}
            />
            <Select
              value={filter}
              onChange={setFilter}
              icon={<IconFilter size={16} />}
              data={[
                { value: 'all', label: 'All Partners' },
                { value: 'online', label: 'Online' },
                { value: 'offline', label: 'Offline' },
              ]}
              style={{ width: '200px' }}
            />
          </Group>
        </Group>

        {loading ? (
          <Group position="center" style={{ minHeight: '200px' }}>
            <Text>Loading delivery partners...</Text>
          </Group>
        ) : filteredDeliveryBoys.length === 0 ? (
          <Group position="center" style={{ minHeight: '200px' }}>
            <Text color="dimmed">No delivery partners found</Text>
          </Group>
        ) : (
          <Grid>
            {filteredDeliveryBoys.map((boy) => (
              <Grid.Col key={boy._id} xs={12} sm={6} md={4} lg={3}>
                <DeliveryBoyCard deliveryBoy={boy} />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Container>
    </Paper>
  );
};

export default DeliveryBoyList;
