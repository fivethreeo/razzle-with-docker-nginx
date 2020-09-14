/**
 * Available variables: 
 * user - the current user (UserModel)
 * realm - the current realm (RealmModel)
 * token - the current token (TokenModel)
 * userSession - the current userSession (UserSessionModel)
 * keycloakSession - the current keycloakSession (KeycloakSessionModel)
 */


//insert your code here...
var roles = [];
for each (var role in user.getRoleMappings()) roles.push(role.getName());
token.setOtherClaims("https://hasura.io/jwt/claims", {
    "x-hasura-user-id": user.getId(),
    "x-hasura-allowed-roles": Java.to(roles, "java.lang.String[]"),
    "x-hasura-default-role": "user",
});
