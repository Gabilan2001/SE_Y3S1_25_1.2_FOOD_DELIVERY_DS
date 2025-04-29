import React, { useState } from 'react';
import { 
  Card, 
  Badge, 
  Image, 
  Stack, 
  Text, 
  Group, 
  ActionIcon,
  Modal,
  Button,
  Divider,
  List
} from '@mantine/core';
import { 
  IconStar, 
  IconBike, 
  IconCircleCheck, 
  IconPhone, 
  IconMail,
  IconMapPin,
  IconId,
  IconLicense,
  IconUser,
  IconEdit,
  IconEye
} from '@tabler/icons-react';

const DeliveryPersonCard = ({ deliveryBoy }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <>
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
        <Card.Section>
          <div style={{ position: 'relative' }}>
            <Image
              src={deliveryBoy.profileImage}
              height={200}
              alt={deliveryBoy.name}
              style={{ objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                display: 'flex',
                gap: '8px'
              }}
            >
              {deliveryBoy.isOnline ? (
                <Badge color="green" variant="filled" size="lg">
                  Online
                </Badge>
              ) : (
                <Badge color="gray" variant="filled" size="lg">
                  Offline
                </Badge>
              )}
            </div>
            {deliveryBoy.isApproved && (
              <Badge
                color="blue"
                variant="filled"
                size="lg"
                style={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                }}
              >
                Verified
              </Badge>
            )}
          </div>
        </Card.Section>

        <Stack mt="md" spacing="sm">
          <Group position="apart">
            <Text weight={700} size="lg">
              {deliveryBoy.name}
            </Text>
            <Group spacing={4}>
              <IconStar size={20} color="orange" fill="orange" />
              <Text weight={600} size="lg">
                {deliveryBoy.rating}
              </Text>
            </Group>
          </Group>

          <Group spacing="xs">
            <IconBike size={16} stroke={1.5} />
            <Text size="sm" color="dimmed">
              {deliveryBoy.vehicleType} • {deliveryBoy.vehicleNumber}
            </Text>
          </Group>

          <Group spacing="xs">
            <IconMapPin size={16} stroke={1.5} />
            <Text size="sm" color="dimmed" lineClamp={1}>
              {deliveryBoy.address}
            </Text>
          </Group>

          <Divider my="sm" />

          <Group position="apart">
            <Text size="sm" color="dimmed" weight={500}>
              {deliveryBoy.totalDeliveries} Deliveries
            </Text>
            <Group>
              <ActionIcon 
                variant="light" 
                color="blue" 
                onClick={() => setDetailsOpen(true)}
              >
                <IconEye size={16} />
              </ActionIcon>
              <ActionIcon variant="light" color="green">
                <IconEdit size={16} />
              </ActionIcon>
            </Group>
          </Group>
        </Stack>
      </Card>

      <Modal
        opened={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={<Text size="lg" weight={700}>Delivery Partner Details</Text>}
        size="lg"
      >
        <Stack spacing="md">
          <Group position="apart">
            <div>
              <Text size="xl" weight={700}>{deliveryBoy.name}</Text>
              <Text size="sm" color="dimmed">ID: {deliveryBoy._id}</Text>
            </div>
            <Group>
              {deliveryBoy.isOnline ? (
                <Badge color="green" size="lg">Online</Badge>
              ) : (
                <Badge color="gray" size="lg">Offline</Badge>
              )}
              {deliveryBoy.isApproved && (
                <Badge color="blue" size="lg">Verified</Badge>
              )}
            </Group>
          </Group>

          <Divider />

          <Group grow>
            <Card withBorder p="md">
              <Group spacing="xs">
                <IconStar size={20} color="orange" fill="orange" />
                <Text weight={700} size="xl">{deliveryBoy.rating}</Text>
              </Group>
              <Text size="sm" color="dimmed">Rating</Text>
            </Card>
            <Card withBorder p="md">
              <Text weight={700} size="xl">{deliveryBoy.totalDeliveries}</Text>
              <Text size="sm" color="dimmed">Deliveries</Text>
            </Card>
          </Group>

          <Stack spacing="xs">
            <Text weight={600}>Contact Information</Text>
            <Group spacing="lg">
              <Group spacing="xs">
                <IconPhone size={16} />
                <Text>{deliveryBoy.phone}</Text>
              </Group>
              <Group spacing="xs">
                <IconMail size={16} />
                <Text>{deliveryBoy.email}</Text>
              </Group>
            </Group>
          </Stack>

          <Stack spacing="xs">
            <Text weight={600}>Vehicle Information</Text>
            <List spacing="xs">
              <List.Item icon={<IconBike size={16} />}>
                Type: {deliveryBoy.vehicleType}
              </List.Item>
              <List.Item icon={<IconId size={16} />}>
                Number: {deliveryBoy.vehicleNumber}
              </List.Item>
              <List.Item icon={<IconLicense size={16} />}>
                License: {deliveryBoy.vehicleLicense}
              </List.Item>
            </List>
          </Stack>

          <Stack spacing="xs">
            <Text weight={600}>Personal Information</Text>
            <List spacing="xs">
              <List.Item icon={<IconMapPin size={16} />}>
                Address: {deliveryBoy.address}
              </List.Item>
              <List.Item icon={<IconId size={16} />}>
                ID Proof: {deliveryBoy.idProof}
              </List.Item>
            </List>
          </Stack>

          <Group position="right" mt="md">
            <Button variant="default" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
            <Button color="blue">
              Edit Details
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default DeliveryPersonCard; 