const PageHeader = ({ eyebrow, title, description, actions }) => {
  return <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
      <div className="min-w-0 max-w-3xl space-y-2">
        <p className="page-kicker">{eyebrow}</p>
        <h1 className="page-title" style={{ textWrap: "balance" }}>
          {title}
        </h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {actions}
        </div>}
    </header>;
};

export {
  PageHeader
};
