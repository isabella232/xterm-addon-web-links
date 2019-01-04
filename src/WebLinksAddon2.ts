/**
 * Copyright (c) 2017 The xterm.js authors. All rights reserved.
 * @license MIT
 */

import { Terminal, ILinkMatcherOptions } from 'xterm';

// TODO: This is temporary, link to xterm when the new version is published
export interface ITerminalAddon {
    dispose(): void;
}

const protocolClause = '(https?:\\/\\/)';
const domainCharacterSet = '[\\da-z\\.-]+';
const negatedDomainCharacterSet = '[^\\da-z\\.-]+';
const domainBodyClause = '(' + domainCharacterSet + ')';
const tldClause = '([a-z\\.]{2,6})';
const ipClause = '((\\d{1,3}\\.){3}\\d{1,3})';
const localHostClause = '(localhost)';
const portClause = '(:\\d{1,5})';
const hostClause = '((' + domainBodyClause + '\\.' + tldClause + ')|' + ipClause + '|' + localHostClause + ')' + portClause + '?';
const pathClause = '(\\/[\\/\\w\\.\\-%~:]*)*([^:"\'\\s])';
const queryStringHashFragmentCharacterSet = '[0-9\\w\\[\\]\\(\\)\\/\\?\\!#@$%&\'*+,:;~\\=\\.\\-]*';
const queryStringClause = '(\\?' + queryStringHashFragmentCharacterSet + ')?';
const hashFragmentClause = '(#' + queryStringHashFragmentCharacterSet + ')?';
const negatedPathCharacterSet = '[^\\/\\w\\.\\-%]+';
const bodyClause = hostClause + pathClause + queryStringClause + hashFragmentClause;
const start = '(?:^|' + negatedDomainCharacterSet + ')(';
const end = ')($|' + negatedPathCharacterSet + ')';
const strictUrlRegex = new RegExp(start + protocolClause + bodyClause + end);

function handleLink(event: MouseEvent, uri: string): void {
  window.open(uri, '_blank');
}

export class WebLinksAddon implements ITerminalAddon {
  private _linkMatcherId: number;

  constructor(private _terminal: Terminal) {
  }

  public init(handler: (event: MouseEvent, uri: string) => void = handleLink, options: ILinkMatcherOptions = {}): void {
    options.matchIndex = 1;
    this._linkMatcherId = this._terminal.registerLinkMatcher(strictUrlRegex, handler, options);
  }

  public dispose(): void {
    this._terminal.deregisterLinkMatcher(this._linkMatcherId);
  }
}