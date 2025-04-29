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

  useEffect(() => {
    const fetchDeliveryBoys = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/delivery-boys');
        setDeliveryBoys(response.data);
      } catch (error) {
        console.error('Error fetching delivery boys:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryBoys();
  }, []);

  const filteredDeliveryBoys = deliveryBoys.filter(boy => {
    const matchesSearch = boy.name.toLowerCase().includes(search.toLowerCase()) ||
                         boy.vehicleNumber.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'online') return matchesSearch && boy.isOnline;
    if (filter === 'offline') return matchesSearch && !boy.isOnline;
    if (filter === 'approved') return matchesSearch && boy.isApproved;
    if (filter === 'pending') return matchesSearch && !boy.isApproved;
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
                { value: 'approved', label: 'Verified' },
                { value: 'pending', label: 'Pending Verification' },
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