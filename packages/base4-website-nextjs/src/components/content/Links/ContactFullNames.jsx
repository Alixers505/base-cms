import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'object-path';
import classNames from 'classnames';
import ObjectValue from '../Elements/ObjectValue';
import Link from '../Link';
import { getAsArray, modelClassNames } from '../../../utils';

const propTypes = {
  children: PropTypes.func,
  className: PropTypes.string,
  collapsible: PropTypes.bool,
  elementAttrs: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  linkAttrs: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  path: PropTypes.oneOf(['authors', 'contributors', 'photographers']).isRequired,
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

const defaultProps = {
  children: undefined,
  className: null,
  collapsible: true,
  elementAttrs: {},
  linkAttrs: {},
  tag: 'div',
};

const ContactFullNameLinks = ({
  children,
  className,
  collapsible,
  content,
  path,
  elementAttrs,
  linkAttrs,
  tag: Tag,
  ...attrs
}) => {
  const edgesPath = `${path}.edges`;
  const edges = getAsArray(content, edgesPath);
  if (collapsible && !edges.length) return null;
  return (
    <Tag className={classNames(modelClassNames('content', edgesPath), className)} {...attrs}>
      {edges.map((edge) => {
        const key = get(edge, 'node.id');
        const canonicalPath = get(edge, 'node.canonicalPath');
        if (collapsible && !canonicalPath) return null;
        return (
          <ObjectValue key={key} path="node.fullName" obj={edge} collapsible={collapsible} {...elementAttrs}>
            {fullName => (
              <Link canonicalPath={canonicalPath} value={fullName} {...linkAttrs}>
                {children}
              </Link>
            )}
          </ObjectValue>
        );
      })}
    </Tag>
  );
};

ContactFullNameLinks.displayName = 'Content/Links/ContactFullNames';
ContactFullNameLinks.propTypes = propTypes;
ContactFullNameLinks.defaultProps = defaultProps;

export default ContactFullNameLinks;