import Markdown from "react-markdown";

/**
 * Renders CMS-authored Markdown safely. Raw HTML in the source is not rendered
 * (react-markdown escapes it by default) and unsafe link protocols are stripped.
 */
export function RichText({ markdown, className = "" }: { markdown: string; className?: string }) {
  return (
    <div className={`prose-ministry ${className}`}>
      <Markdown
        skipHtml
        components={{
          h1: ({ children }) => <h2>{children}</h2>,
          a: ({ href, children }) => {
            const external = href ? /^https?:\/\//i.test(href) : false;
            return (
              <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {children}
              </a>
            );
          },
          img: () => null,
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
