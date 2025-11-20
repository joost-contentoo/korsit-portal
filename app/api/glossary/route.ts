import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const GLOSSARY_PATH = path.join(process.cwd(), 'glossary.md');

export async function GET() {
    try {
        // Check if file exists, if not return empty string
        try {
            await fs.access(GLOSSARY_PATH);
        } catch {
            return NextResponse.json({ content: '' });
        }

        const content = await fs.readFile(GLOSSARY_PATH, 'utf-8');
        return NextResponse.json({ content });
    } catch (error) {
        console.error('Error reading glossary:', error);
        return NextResponse.json(
            { error: 'Failed to read glossary' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { content } = await request.json();

        if (typeof content !== 'string') {
            return NextResponse.json(
                { error: 'Content must be a string' },
                { status: 400 }
            );
        }

        await fs.writeFile(GLOSSARY_PATH, content, 'utf-8');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving glossary:', error);
        return NextResponse.json(
            { error: 'Failed to save glossary' },
            { status: 500 }
        );
    }
}
