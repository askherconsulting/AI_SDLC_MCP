---
name: wordpress-blog-from-session
description: Create WordPress draft blog posts from current chat sessions
---

# WordPress Blog Post from Session Skill

Use this skill to create engaging WordPress draft blog posts based on the current chat conversation or a locally stored blog post file. This skill analyzes the session or local file, extracts key learnings or content, and publishes them as a draft post to WordPress using the WordPress MCP server.

## Prerequisites

- WordPress MCP server must be configured and accessible
- User must have appropriate WordPress credentials and permissions
- The MCP server should expose WordPress post creation/update tools

## Instructions

### Step 1: Choose the Source

Decide which source to use:
- **Current Session**: Build a narrative post from the chat history.
- **Local File**: Upload a locally stored blog post file (Markdown or HTML).

If using a local file, read it from disk with the Read tool and skip to Step 3.

### Step 2: Analyze the Current Session

Review the entire conversation history and identify:
- **Main Topic/Goal**: What was the user trying to accomplish?
- **Key Steps Taken**: What actions were performed?
- **Challenges Faced**: Were there any obstacles or failures?
- **Solutions Applied**: How were problems resolved?
- **Final Outcome**: What was successfully achieved?
- **Technical Details**: Code snippets, commands, configurations used
- **Lessons Learned**: Important takeaways and insights

### Step 3: Structure the Blog Post

Create a well-structured blog post with the following sections:

1. **Title**: Create an engaging, descriptive title (e.g., "Building and Testing Vibium Test Suites: A Journey from Creation to Success")

2. **Introduction**:
   - Hook the reader with the problem or goal
   - Briefly explain what was accomplished
   - Set expectations for what they'll learn

3. **Background/Context**:
   - Explain the project setup
   - Describe the technology stack
   - Define any domain-specific terms

4. **The Journey** (main content):
   - Walk through the process chronologically
   - Include code snippets with explanations
   - Show both failures and successes
   - Explain reasoning behind decisions

5. **Challenges and Solutions**:
   - Highlight specific problems encountered
   - Explain how each was diagnosed and resolved
   - Share insights that would help others

6. **Results**:
   - Show the final working solution
   - Include test results or output
   - Demonstrate the success metrics

7. **Key Takeaways**:
   - Bullet points of important lessons
   - Tips for others attempting similar tasks
   - Links to relevant documentation

8. **Conclusion**:
   - Summarize the achievement
   - Encourage readers to try it themselves
   - Invite questions or comments

### Step 4: Format for WordPress

- Use proper HTML or Markdown formatting
- Include syntax-highlighted code blocks using `<pre>` or WordPress code block format
- Add appropriate heading levels (H2, H3, H4)
- Format lists, quotes, and emphasis properly
- Consider adding relevant tags/categories

### Step 5: Create the Draft Post

Use the WordPress MCP server tools to:
1. Connect to the WordPress site
2. Create a new post with status "draft"
3. Set the post title
4. Set the post content (formatted HTML/Markdown)
5. Add relevant categories and tags
6. Return the draft post URL for review

### Step 6: Confirm with User

After creating the draft:
- Provide the WordPress draft post URL
- Summarize what was included in the post
- Ask if any revisions are needed before publishing

## Examples

**Example 1**: User completes a testing workflow
- Input: Session about creating Vibium negative tests and fixing routing issues
- Output: Blog post titled "Creating Comprehensive Negative Test Suites with Vibium" covering test creation, server configuration, and debugging

**Example 2**: User implements a new feature
- Input: Session about adding authentication to an API
- Output: Blog post titled "Implementing JWT Authentication in Express.js: A Step-by-Step Guide"

**Example 3**: User troubleshoots a problem
- Input: Session debugging performance issues
- Output: Blog post titled "Debugging and Optimizing Node.js Performance: A Real-World Case Study"

## Guidelines

- **Be Narrative**: Write as a story or journey, not just technical documentation
- **Be Honest**: Include failures and mistakes - they're valuable learning experiences
- **Be Specific**: Include actual code, commands, and error messages from the session
- **Be Educational**: Explain the "why" behind decisions, not just the "what"
- **Be Concise**: Keep it focused on the main topic, avoid tangents
- **Be Practical**: Provide actionable takeaways readers can apply
- **Respect Privacy**: Remove any sensitive information (API keys, passwords, personal data)
- **Give Credit**: Mention tools, frameworks, and resources used
- **Use Proper Tone**: Professional but conversational, accessible to the target audience
- **Use UK English**: Write in British English spelling and phrasing (e.g. "optimise", "favour", "colour")

## WordPress MCP Tools

The skill expects the following MCP tools to be available:
- `wpcom-mcp-post-create` or similar - to create a new draft post
- `wpcom-mcp-post-update` (optional) - to update a draft if re-uploading
- `wpcom-mcp-posts-search` (optional) - to find existing drafts by title
- `wordpress_get_categories` or equivalent (optional) - to fetch available categories
- `wordpress_get_tags` or equivalent (optional) - to fetch available tags

## Local File Upload Flow

Use this flow when the user wants to upload a locally stored blog post:

1. **Read the file** from disk with the Read tool.
2. **Detect format**:
   - If Markdown, keep as Markdown unless the WordPress tool requires HTML.
   - If HTML, pass through as-is.
3. **Create the draft** using the WordPress MCP create tool.
4. **Return the draft URL** and summarize any transformations applied.

## Error Handling

If WordPress MCP server is unavailable:
1. Inform the user the WordPress server is not accessible
2. Offer to save the blog post content to a local file instead
3. Provide instructions for manual WordPress upload

## Notes

- Always create as "draft" status first for user review
- Allow user to edit before publishing
- Consider the target audience's technical level
- Keep blog posts between 800-2000 words for optimal engagement
- Include metadata like estimated reading time if WordPress supports it
