
// Returns a variable property by text length; use to choose between paddings, font sizes, etc.
export const adjustPropertySizebyTextLength = (text, cutoff = 10, shortSize = '12px', longSize = '8px') => {
  return text.length > cutoff ? longSize : shortSize
}
