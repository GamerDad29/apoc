import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { renderMessageContent } from './MessageBubble';

function render(text: string, query?: string): string {
  const nodes = renderMessageContent(text, query);
  return renderToStaticMarkup(<>{nodes}</>);
}

describe('MessageBubble.renderMessageContent', () => {
  it('escapes raw HTML and does not execute script tags', () => {
    const html = render('<script>alert("xss")</script>');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('alert(&quot;xss&quot;)');
  });

  it('escapes img onerror injection attempts', () => {
    const html = render('<img src=x onerror="alert(1)">');
    // The raw tag must never appear — only escaped entities.
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img');
    expect(html).toContain('&quot;alert(1)&quot;');
  });

  it('renders strong and em without introducing raw HTML', () => {
    const html = render('**bold** and *italic*');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<em>italic</em>');
  });

  it('renders fenced code blocks with escaped content', () => {
    const html = render('```<script>bad</script>```');
    expect(html).toContain('<pre>');
    expect(html).toContain('&lt;script&gt;bad&lt;/script&gt;');
    expect(html).not.toContain('<script>bad</script>');
  });

  it('renders inline code with escaped content', () => {
    const html = render('use `<div>` for layout');
    expect(html).toContain('<code>&lt;div&gt;</code>');
  });

  it('highlights search matches without breaking escaping', () => {
    const html = render('find this <evil>', 'this');
    expect(html).toContain('<mark');
    expect(html).toContain('this');
    expect(html).toContain('&lt;evil&gt;');
    expect(html).not.toContain('<evil>');
  });

  it('does not treat a lone asterisk as emphasis', () => {
    const html = render('2 * 3 = 6');
    expect(html).not.toContain('<em>');
  });
});
