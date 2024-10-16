/**
 * This decorator enforces a class to implement
 *   methods of an interface as static methods.
 *
 */
export function StaticImplements<Static>() {
  return <Class extends Static>(constructor: Class) => constructor;
}
