import fs from 'fs'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const formData = await req.formData();
  const formDataEntryValues = Array.from(formData.values());
  for (const formDataEntryValue of formDataEntryValues) {
    if (typeof formDataEntryValue === 'object' && 'arrayBuffer' in formDataEntryValue) {
      const file = formDataEntryValue;
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(`src/app/images/${file.name}`, buffer);
    }
  }
  return NextResponse.json({ success: true });
}
