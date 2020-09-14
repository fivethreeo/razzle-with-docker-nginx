const serverEnv = (key, def) => process?.env?.[key] ?? def

function getKeycloakConfig() {
  return typeof window !== 'undefined' && window.env !== 'undefined'
    ? {
        // client
        url: window.env.client_url,
        clientId: window.env.clientId,
        realm: window.env.realm
      }
    : {
        // server
        url: serverEnv('KEYCLOAK_SERVER_URL', 'http://localhost:8080/auth'),
        client_url: serverEnv('KEYCLOAK_CLIENT_URL', 'http://localhost:8080/auth'),
        clientId: serverEnv('KEYCLOAK_CLIENT_ID', 'react-test'),
        realm: serverEnv('KEYCLOAK_REALM', 'Test'),
      }
}

export { getKeycloakConfig }
