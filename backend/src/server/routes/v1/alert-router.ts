import { z } from "zod";

import { AlertsSchema } from "@app/db/schemas";
import { readLimit, writeLimit } from "@app/server/config/rateLimiter";
import { verifyAuth } from "@app/server/plugins/auth/verify-auth";
import { AuthMode } from "@app/services/auth/auth-type";

export const registerAlertRouter = async (server: FastifyZodProvider) => {
  server.route({
    method: "POST",
    url: "/",
    config: {
      rateLimit: writeLimit
    },
    onRequest: verifyAuth([AuthMode.JWT, AuthMode.IDENTITY_ACCESS_TOKEN]),
    schema: {
      description: "Create alert",
      body: z.object({
        projectId: z.string().trim(),
        name: z.string().trim(),
        alertBeforeDays: z.number(),
        emails: z.array(z.string())
      }),
      response: {
        200: AlertsSchema
      }
    },
    handler: async (req) => {
      const alert = await server.services.alert.createAlert({
        actor: req.permission.type,
        actorId: req.permission.id,
        actorAuthMethod: req.permission.authMethod,
        actorOrgId: req.permission.orgId,
        ...req.body
      });

      // TODO: audit logging

      //   await server.services.auditLog.createAuditLog({
      //     ...req.auditLogInfo,
      //     projectId: ca.projectId,
      //     event: {
      //       type: EventType.REVOKE_CERT,
      //       metadata: {
      //         certId: cert.id,
      //         cn: cert.commonName,
      //         serialNumber: cert.serialNumber
      //       }
      //     }
      //   });

      return alert;
    }
  });

  server.route({
    method: "GET",
    url: "/:alertId",
    config: {
      rateLimit: readLimit
    },
    onRequest: verifyAuth([AuthMode.JWT, AuthMode.IDENTITY_ACCESS_TOKEN]),
    schema: {
      description: "Get alert",
      params: z.object({
        alertId: z.string().trim()
      }),
      response: {
        200: AlertsSchema
      }
    },
    handler: async (req) => {
      const alert = await server.services.alert.getAlertById({
        alertId: req.params.alertId,
        actor: req.permission.type,
        actorId: req.permission.id,
        actorAuthMethod: req.permission.authMethod,
        actorOrgId: req.permission.orgId
      });

      // TODO: audit logging

      //   await server.services.auditLog.createAuditLog({
      //     ...req.auditLogInfo,
      //     projectId: ca.projectId,
      //     event: {
      //       type: EventType.GET_CA,
      //       metadata: {
      //         caId: ca.id,
      //         dn: ca.dn
      //       }
      //     }
      //   });

      return alert;
    }
  });

  server.route({
    method: "PATCH",
    url: "/:alertId",
    config: {
      rateLimit: readLimit
    },
    onRequest: verifyAuth([AuthMode.JWT, AuthMode.IDENTITY_ACCESS_TOKEN]),
    schema: {
      description: "Update alert",
      params: z.object({
        alertId: z.string().trim()
      }),
      body: z.object({
        name: z.string().trim().optional(),
        alertBeforeDays: z.number().optional(),
        emails: z.array(z.string()).optional()
      }),
      response: {
        200: AlertsSchema
      }
    },
    handler: async (req) => {
      const alert = await server.services.alert.updateAlert({
        alertId: req.params.alertId,
        actor: req.permission.type,
        actorId: req.permission.id,
        actorAuthMethod: req.permission.authMethod,
        actorOrgId: req.permission.orgId,
        ...req.body
      });

      // TODO: audit logging

      //   await server.services.auditLog.createAuditLog({
      //     ...req.auditLogInfo,
      //     projectId: ca.projectId,
      //     event: {
      //       type: EventType.GET_CA,
      //       metadata: {
      //         caId: ca.id,
      //         dn: ca.dn
      //       }
      //     }
      //   });

      return alert;
    }
  });

  server.route({
    method: "DELETE",
    url: "/:alertId",
    config: {
      rateLimit: writeLimit
    },
    onRequest: verifyAuth([AuthMode.JWT, AuthMode.IDENTITY_ACCESS_TOKEN]),
    schema: {
      description: "Delete alert",
      params: z.object({
        alertId: z.string().trim()
      }),
      response: {
        200: AlertsSchema
      }
    },
    handler: async (req) => {
      const alert = await server.services.alert.deleteAlert({
        alertId: req.params.alertId,
        actor: req.permission.type,
        actorId: req.permission.id,
        actorAuthMethod: req.permission.authMethod,
        actorOrgId: req.permission.orgId
      });

      // TODO: audit logging

      //   await server.services.auditLog.createAuditLog({
      //     ...req.auditLogInfo,
      //     projectId: ca.projectId,
      //     event: {
      //       type: EventType.DELETE_CERT,
      //       metadata: {
      //         certId: deletedCert.id,
      //         cn: deletedCert.commonName,
      //         serialNumber: deletedCert.serialNumber
      //       }
      //     }
      //   });

      return alert;
    }
  });
};
