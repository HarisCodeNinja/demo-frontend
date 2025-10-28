// src/lib/getDefaultFormValues.ts
import { z } from 'zod';

/**
 * Generate sensible default values for a Zod schema.
 * - For z.object(): returns an object whose keys are present and filled either by schema defaults (if set)
 *   or by sensible fallbacks ("" / false / 0 / [] / nested object).
 * - For other schemas: if there's a default wrapper, parse(undefined) will return it; otherwise we provide
 *   a fallback for primitives.
 *
 * Limitations:
 * - If you need specialized default generation for unions/enums/literals you can extend the fallback logic.
 * - This attempts to be safe for typical form use-cases.
 */

type ZodAny = z.ZodTypeAny;

export function getDefaultFormValues<T extends ZodAny>(schema: T): z.infer<T> {
  // If it's an object schema -> handle keys recursively
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    // Try to apply any explicit defaults using partial({ deep: true }) so missing required fields are allowed
    let parsedDefaults: Partial<Record<string, unknown>> = {};
    try {
      // partial({ deep: true }) lets parse({}) succeed while still applying any .default() you set on fields
      parsedDefaults = (schema.partial({ deep: true }) as z.ZodObject<any>).parse({});
    } catch {
      parsedDefaults = {};
    }

    const result: Record<string, unknown> = {};

    for (const key of Object.keys(shape)) {
      const childSchema = shape[key];

      // If parse produced a defined value (from a .default() on the field), keep it
      if (parsedDefaults && typeof parsedDefaults[key] !== 'undefined') {
        result[key] = parsedDefaults[key];
        continue;
      }

      // Otherwise, determine fallback according to child schema type
      if (childSchema instanceof z.ZodString) {
        result[key] = '';
      } else if (childSchema instanceof z.ZodBoolean) {
        result[key] = false;
      } else if (childSchema instanceof z.ZodNumber) {
        result[key] = 0;
      } else if (childSchema instanceof z.ZodDate) {
        result[key] = null; // date inputs you may want null -> application can transform to ''
      } else if (childSchema instanceof z.ZodArray) {
        result[key] = [];
      } else if (childSchema instanceof z.ZodObject) {
        // Recurse
        result[key] = getDefaultFormValues(childSchema);
      } else if (childSchema instanceof z.ZodOptional || childSchema instanceof z.ZodNullable) {
        const inner = (childSchema as any)._def?.innerType ?? (childSchema as any)._def?.type;
        if (inner instanceof z.ZodObject) {
          result[key] = getDefaultFormValues(inner);
        } else if (inner instanceof z.ZodArray) {
          result[key] = [];
        } else if (inner instanceof z.ZodBoolean) {
          result[key] = false;
        } else if (inner instanceof z.ZodNumber) {
          result[key] = 0;
        } else {
          result[key] = '';
        }
      } else {
        // fallback generic
        result[key] = '';
      }
    }

    return result as z.infer<T>;
  }

  // Non-object schemas:
  // If schema wraps a default (z.string().default(...)), parsing `undefined` will return that default.
  try {
    // For primitive schemas with .default(), parse(undefined) returns the default.
    return schema.parse(undefined as unknown) as z.infer<T>;
  } catch {
    // Provide primitive fallbacks
    if (schema instanceof z.ZodString) return '' as z.infer<T>;
    if (schema instanceof z.ZodNumber) return 0 as z.infer<T>;
    if (schema instanceof z.ZodBoolean) return false as z.infer<T>;
    if (schema instanceof z.ZodArray) return [] as z.infer<T>;
    if (schema instanceof z.ZodDate) return null as unknown as z.infer<T>;
    // Fallback to undefined-like empty
    return undefined as unknown as z.infer<T>;
  }
}
