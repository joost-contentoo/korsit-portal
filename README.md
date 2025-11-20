# The Localizer

A local productivity interface for localizing English Markdown blog posts into German using an n8n automation workflow.

## Features

- **Split-Screen Layout**: 50/50 input and preview panes
- **Markdown Support**: Full markdown rendering with syntax highlighting
- **Smart Error Handling**: Graceful error messages and loading states
- **Witty Loading Messages**: Engaging feedback during processing
- **n8n Integration**: Backend proxy for secure webhook communication

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS with Typography plugin
- React Markdown
- Lucide React (icons)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An n8n webhook URL for localization processing

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file in the project root:
```bash
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/path
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Paste your English Markdown content into the **Blog Content** text area (top left)
2. Add SEO context and instructions in the **SEO Context** text area (bottom left)
3. Click **Localize to German**
4. View the localized content in the preview pane (right side)

## Project Structure

```
├── app/
│   ├── api/
│   │   └── localize/
│   │       └── route.ts          # Backend proxy for n8n
│   ├── components/
│   │   └── MarkdownPreview.tsx   # Markdown rendering component
│   ├── globals.css               # Global styles with Tailwind
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main application page
├── docs/
│   └── PRD.md                    # Product Requirements Document
└── .env.local.example            # Environment variable template
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `N8N_WEBHOOK_URL` | Your n8n webhook endpoint URL | Yes |

## Development

The application uses:
- **Backend-for-Frontend (BFF)** pattern to avoid CORS issues
- **Resilient response parsing** to handle various n8n output formats
- **Client-side state management** with React hooks
- **Tailwind v4** with the new `@plugin` directive

## License

MIT
