Colors
Gradients
	- linear-gradient / repeating-linear-gradient
	- radial-gradient / repeating-radial-gradient
	- conic-gradient

Shadows
	- box-shadow
		- inner
		- outer
	- text-shadow

Aspect Ratios

Typography
	- font-family
	- font-size
	- font-weight
	- hyphenation
	- letter-spacing
	- line-height
	- overflow

Easing
	- built-in
	cubic-bezier

Animations
	 - delay (dimension)
	 - direction (string: normal, reverse, alternate, alternate-reverse)
	 - duration (dimension)
	 - fill-mode (string: none, forwards, backwards, both)
	 - iteration-count (number)
	 - name (string)
	 - play-state (string: running, paused)
	 - timing-function (easing)

Sizes
	- dimension
	- fluid (clamp-function)

Borders
	- color (color) 
	- size (dimension)
	- radius (dimensen / ratio)
	- style (string: none, hidden, dotted, dashed, solid, double, groove, ridge, inset, outset)

Shapes (masks)

Files
	- url()-function, preview as icon

Other
	- catch-all (string)

	---


Hey,
Looked into the proposed documentation for Design Tokens: https://design-tokens.github.io/community-group/format

As an example, we could use this format, using the CSS Custom Property key as key:

```
"--space-small": {
	type: "dimension",
	value: "0.25rem",
	description: "..."
}
```

"dimension" is a raw CSS-type. Another such type is "shadow", but here I propose a sub-group (called "group") as a box-shadow will not always work as atext-shadow, even though they share the same "raw" type:

```
"--bxsh-medium": {
	type: "shadow",
	group: "shadows.boxShadow",
	scope: 'root',
	description: "A small box-shadow",
	value: "0 0 5px 3px rgb(100, 100, 100, .8)"
}
```

"--bxsh-medium": {
	type: "shadow",
	group: "shadows.boxShadow",
	scope: 'root',
	description: "A small box-shadow",
	value: "0 0 5px 3px {colors.--color-blue-8}"
}

"--color-blue-8": {
	type: "color",
	group: "colors",
	scope: 'root',
	description: "A dark blue color",
	value: "hsl(200, 50%, 40%)"
}

"--anid-200": {
	type: "time",
	group: "animations.delay",
	scope: 'layout-outer',
	description: "Animation-delay of 200ms",
	value: "200ms"
}
```

"composite" tokens are also supported, where "value" are the individual properties:

```
"--bxsh-medium": {
	type: "shadow",
	group: "box-shadow",
	description: "A small box-shadow",
	value: {
		"offsetX": "0px",
		"offsetY": "0px",
		"blur": "5px",
		"spread": "3px",
		"color": "rgb(100, 100, 100, .8)",
	}
}
```

This would work well with a visual editor, so you can populate the values.

That brings us to "Groups": https://design-tokens.github.io/community-group/format/#groups

Here, I'm in doubt. To use it as a "style-guide", we could do something like:

```
"Animations": {
	"--anim-delay-short": {
		"group": "delay",
		"value": "20ms",
		"type": "time"
	},
		"--anim-delay-long": {
		"group": "delay",
		"value": "200ms",
		"type": "time"
	},
}
```

... but when importing, we'd need to be very clever to determine what's a group and what's a token.

I'd like our Style Gyuide / Theme Manager to look similar to:

Colors
Gradients
	- linear-gradient / repeating-linear-gradient
	- radial-gradient / repeating-radial-gradient
	- conic-gradient

Shadows
	- box-shadow
		- inner
		- outer
	- text-shadow

Aspect Ratios

Typography
	- font-family
	- font-size
	- font-weight
	- hyphenation
	- letter-spacing
	- line-height
	- overflow

Easing
	- built-in
	cubic-bezier

Animations
	 - delay (dimension)
	 - direction (string: normal, reverse, alternate, alternate-reverse)
	 - duration (dimension)
	 - fill-mode (string: none, forwards, backwards, both)
	 - iteration-count (number)
	 - name (string)
	 - play-state (string: running, paused)
	 - timing-function (easing)

Sizes
	- dimension
	- fluid (clamp-function)

Borders
	- color (color) 
	- size (dimension)
	- radius (dimensen / ratio)
	- style (string: none, hidden, dotted, dashed, solid, double, groove, ridge, inset, outset)

Shapes (masks)

Files
	- url()-function, preview as icon

Other
	- catch-all (string)