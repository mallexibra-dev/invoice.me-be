export default function prismaError(error: any):
  | {
      error: boolean;
      message: string;
      statusCode?: number;
    }
  | undefined {
  const target = (error.meta?.target ?? [])[0];

  if (error.name == "PrismaClientKnownRequestError") {
    switch (error.code) {
      case "P2000":
        return {
          error: true,
          message: `${target || "Field"} value is too long.`,
          statusCode: 400,
        };
      case "P2001":
        return {
          error: true,
          message: `${target || "Record"} not found.`,
          statusCode: 404,
        };
      case "P2002":
        console.log("dari p2002");
        return {
          error: true,
          message: `${target || "Field"} already exists.`,
          statusCode: 400,
        };
      case "P2003":
        return {
          error: true,
          message: `${target || "Field"} failed foreign key constraint.`,
          statusCode: 400,
        };
      case "P2004":
        return {
          error: true,
          message: `Database constraint violation on ${target || "a field"}.`,
          statusCode: 400,
        };
      case "P2005":
        return {
          error: true,
          message: `${target || "Field"} has invalid value.`,
          statusCode: 400,
        };
      case "P2006":
        return {
          error: true,
          message: `Invalid filter condition on ${target || "a field"}.`,
          statusCode: 400,
        };
      case "P2007":
        return {
          error: true,
          message: `Unknown data error on ${target || "a field"}.`,
          statusCode: 400,
        };
      case "P2008":
        return {
          error: true,
          message: `Query parsing error.`,
          statusCode: 400,
        };
      case "P2010":
        return {
          error: true,
          message: `Raw query execution error.`,
          statusCode: 400,
        };
      case "P2011":
        return {
          error: true,
          message: `${target || "Field"} received null but is not nullable.`,
          statusCode: 400,
        };
      case "P2012":
        return {
          error: true,
          message: `Missing required value for ${target || "a field"}.`,
          statusCode: 400,
        };
      case "P2013":
        return {
          error: true,
          message: `Missing required argument: ${target || "unknown field"}.`,
          statusCode: 400,
        };
      case "P2014":
        return {
          error: true,
          message: `Relation constraint violation on ${target || "relation"}.`,
          statusCode: 400,
        };
      case "P2015":
        return {
          error: true,
          message: `Record not found in nested operation on ${
            target || "relation"
          }.`,
          statusCode: 404,
        };
      default:
        return {
          error: false,
          message: `Unhandled Prisma error (code: ${error.code}).`,
          statusCode: 500,
        };
    }
  }

  if (error.name == "PrismaClientValidationError") {
    return { error: true, message: `Invalid Prisma query.`, statusCode: 400 };
  }

  if (error.name == "PrismaClientInitializationError") {
    return {
      error: true,
      message: `Failed to connect to the database.`,
      statusCode: 500,
    };
  }

  if (error.name == "PrismaClientRustPanicError") {
    return {
      error: true,
      message: `Unexpected Prisma engine error.`,
      statusCode: 500,
    };
  }

  return {
    error: false,
    message: `An unexpected error occurred.`,
    statusCode: 500,
  };
}
