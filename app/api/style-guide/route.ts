import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const STYLE_GUIDE_PATH = path.join(process.cwd(), 'style-guide.md');

export async function GET() {
    try {
        const content = await fs.readFile(STYLE_GUIDE_PATH, 'utf-8');
        return NextResponse.json({ content });
    } catch (error) {
        console.error('Error reading style guide:', error);
        return NextResponse.json(
            { error: 'Failed to read style guide' },
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

        await fs.writeFile(STYLE_GUIDE_PATH, content, 'utf-8');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving style guide:', error);
        return NextResponse.json(
            { error: 'Failed to save style guide' },
            { status: 500 }
        );
    }
}
