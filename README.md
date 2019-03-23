# Feisty

Feisty is a simple, zero-configuration website build tool based on the filesystem
structure and React components and intended to enable small to medium website 
creation.

## How to Run
You can run it in dev mode and use to pre-build pages of your website.

- `feisty init` - creates a simple website folder structure
- `feisty dev` - runs a dev server with hot reloading
- `feisty build` - build your website into static pages
- `feisty publish` - publishes it using a plugin

## Folder Structure and Conventions
Since feisty is a zero-configuration utility, it expects you to stick to having
`content/` and `components/` folders in the root where you run the command. Also,
there are some conventions used.

A page entry is its `index.yml` file. Inside, you may have any hierarchy with a
few reserved keys:

- `component` names the used components. The path is based upon `components/`
folder. You may not use file extension.
- `content` is a key allowing to load an `*.md` or `*.yml` file from the
filesystem.
- `list` contains a glob that allows you to load resources

All `index.yml` files comprise the structure of your website. Each file is read,
the content is processed with either a Markdown or a YAML parser, and passed to
the corresponding component so it can render the page. The page is then put on
the filesystem according to its original placement.

## ToDo

- URLs
