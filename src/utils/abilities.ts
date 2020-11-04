const { AbilityBuilder, Ability } = require("@casl/ability");

let ANONYMOUS_ABILITY: any;

export function defineAbilityFor(user: any) {
  if (user) {
    return new Ability(defineRulesFor(user));
  }

  ANONYMOUS_ABILITY = ANONYMOUS_ABILITY || new Ability(defineRulesFor({}));
  return ANONYMOUS_ABILITY;
}

export function defineRulesFor(user: any) {
  const { rules, can } = new AbilityBuilder();

  switch (user.role) {
    case "admin":
      defineAdminRules(user, can);
      break;
    case "writer":
      defineWriterRules(user, can);
      break;
    default:
      defineAnonymousRules(user, can);
      break;
  }

  return rules;
}

function defineAdminRules(_: any, can: any) {
  can("manage", "all");
}

function defineWriterRules(user: any, can: any) {
  defineAnonymousRules(user, can);

  can(["read", "create", "delete", "update"], ["Article", "Comment"], {
    author: user._id,
  });
  can("publish", "Article", {
    author: user._id,
    published: false,
  });
  can(["read", "update"], "User", { _id: user._id });
}

function defineAnonymousRules(_: any, can: any) {
  // can("read", ["Article", "Comment"], ["a", "b"], { published: true });
  can("read", "User");
  can("read");
}
