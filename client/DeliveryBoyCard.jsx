import React from 'react';
import { Card, Badge, Image, Stack, Text, Group, ActionIcon } from '@mantine/core';
import { IconStar, IconBike, IconTruck, IconCircleCheck, IconPhone, IconMail } from '@tabler/icons-react';

const DeliveryBoyCard = ({ deliveryBoy }) => {
  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder
      style={{
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Card.Section p="md" style={{ backgroundColor: '#f8f9fa' }}>
        <Group position="apart">
          <Group>
            <Image
              src={deliveryBoy.profileImage}
              height={60}
              width={60}
              radius="xl"
              alt={deliveryBoy.name}
            />
            <Stack spacing={5}>
              <Text weight={600} size="lg" color="dark">
                {deliveryBoy.name}
              </Text>
              <Group spacing="xs">
                <IconBike size={16} stroke={1.5} />
                <Text size="sm" color="dimmed">
                  {deliveryBoy.vehicleType}
                </Text>
              </Group>
            </Stack>
          </Group>
          {deliveryBoy.isOnline ? (
            <Badge color="green" variant="light" size="lg">
              Online
            </Badge>
          ) : (
            <Badge color="gray" variant="light" size="lg">
              Offline
            </Badge>
          )}
        </Group>
      </Card.Section>

      <Stack mt="md" spacing="sm">
        <Group position="apart">
          <Group spacing="xs">
            <IconStar size={16} color="orange" fill="orange" />
            <Text weight={600} size="lg">
              {deliveryBoy.rating}
            </Text>
          </Group>
          <Text size="sm" color="dimmed" weight={500}>
            {deliveryBoy.totalDeliveries} Deliveries
          </Text>
        </Group>

        <Group spacing="xs">
          <IconPhone size={16} stroke={1.5} />
          <Text size="sm" color="dimmed">
            {deliveryBoy.phone}
          </Text>
        </Group>

        <Text size="sm" color="dimmed" lineClamp={1}>
          {deliveryBoy.address}
        </Text>

        <Group position="apart" mt="xs">
          <Badge 
            color="blue" 
            variant="light"
            size="lg"
            style={{ textTransform: 'none' }}
          >
            {deliveryBoy.vehicleNumber}
          </Badge>
          {deliveryBoy.isApproved && (
            <Group spacing="xs">
              <IconCircleCheck size={16} color="green" />
              <Text size="sm" color="green" weight={500}>
                Verified
              </Text>
            </Group>
          )}
        </Group>
      </Stack>
    </Card>
  );
};

export default DeliveryBoyCard; 