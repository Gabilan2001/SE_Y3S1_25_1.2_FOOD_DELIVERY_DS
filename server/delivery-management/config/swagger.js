import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Delivery Management System API",
      version: "0.1.0",
      description: "API Documentation for Delivery Management System",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:4001",
        description: "Local Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
            type: "apiKey",
            in: "header",
            name: "token", // You can name it "Authorization" to match the common convention
          },
          atoken: {  // For admin-side
            type: "apiKey",
            in: "header",
            name: "atoken", // Admin-specific token
          },
      },
      schemas: {
        DeliveryBoy: {
          type: "object",
          properties: {
            name: { type: "string", example: "John Doe" },
            email: { type: "string", format: "email", example: "john.doe@example.com" },
            phone: { type: "string", example: "+1234567890" },
            password: { type: "string", format: "password", example: "securepassword123" },
            profileImage: { type: "string", format: "uri", example: "https://example.com/profile.jpg" },
            vehicleDetails: {
              type: "object",
              properties: {
                vehicleType: { type: "string", example: "Bike" },
                vehicleNumber: { type: "string", example: "ABC1234" },
              },
            },
            assignedOrders: {
              type: "array",
              items: { type: "string", format: "objectId" },
              example: ["60c72b2f9f1b2b001d5c9c9f"],
            },
            isActive: { type: "boolean", default: true, example: true },
            isApproved: { type: "boolean", default: false, example: false },
            onlineStatus: { type: "boolean", default: false, example: false },
            location: {
              type: "object",
              properties: {
                latitude: { type: "number", default: 0, example: 37.7749 },
                longitude: { type: "number", default: 0, example: -122.4194 },
              },
            },
            rating: { type: "number", default: 0, example: 4.5 },
            ratingCount: { type: "number", default: 0, example: 100 },
            totalDeliveries: { type: "number", default: 0, example: 150 },
            joinedDate: { type: "string", format: "date", example: "2021-01-01" },
            lastActive: { type: "string", format: "date", example: "2021-05-01T12:00:00Z" },
            documents: {
              type: "object",
              properties: {
                idProof: { type: "string", example: "https://example.com/idproof.jpg" },
                vehicleLicense: { type: "string", example: "https://example.com/vehiclelicense.jpg" },
              },
            },
          },
          required: ["name", "email", "phone", "password", "vehicleDetails"],
        },
        Tracking: {
          type: "object",
          properties: {
            orderId: { type: "string", format: "objectId", example: "60c72b2f9f1b2b001d5c9c9f" },
            deliveryPersonId: { type: "string", format: "objectId", example: "60c72b2f9f1b2b001d5c9c9e" },
            currentLocation: {
              type: "object",
              properties: {
                latitude: { type: "number", example: 37.7749 },
                longitude: { type: "number", example: -122.4194 },
                updatedAt: { type: "string", format: "date-time", example: "2021-05-01T12:00:00Z" },
              },
            },
            estimatedDeliveryTime: { type: "string", format: "date-time", example: "2021-05-01T14:00:00Z" },
            actualDeliveryTime: { type: "string", format: "date-time", example: "2021-05-01T13:55:00Z" },
            distanceCovered: { type: "number", default: 0, example: 10.5 },
            status: { type: "string", enum: ["Accepted", "In Progress", "Delivered", "Canceled"], example: "In Progress" },
            statusHistory: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  status: { type: "string", example: "Accepted" },
                  updatedAt: { type: "string", format: "date-time", example: "2021-05-01T12:00:00Z" },
                },
              },
            },
            notes: { type: "string", example: "Customer requested a special delivery time." },
            proofOfDelivery: { type: "string", example: "https://example.com/proofOfDelivery.jpg" },
          },
          required: ["orderId", "deliveryPersonId", "currentLocation", "status"],
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  console.log("Swagger docs available at http://localhost:4001/api-docs");
};

export default swaggerDocs;