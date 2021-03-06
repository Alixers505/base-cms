const { SchemaDirectiveVisitor } = require('graphql-tools');
const formatStatus = require('../utils/format-status');
const criteriaFor = require('../utils/criteria-for');
const applyInput = require('../utils/apply-input');
const shouldCollate = require('../utils/should-collate');
const connectionProjection = require('../utils/connection-projection');

class FindManyDirective extends SchemaDirectiveVisitor {
  /**
   *
   * @param {*} field
   */
  visitFieldDefinition(field) {
    // eslint-disable-next-line no-param-reassign
    field.resolve = async (_, { input = {} }, { basedb }, info) => {
      const start = process.hrtime();

      const {
        model,
        using,
        criteria,
      } = this.args;

      const {
        status,
        sort,
        pagination,
      } = input;

      const query = applyInput({
        query: { ...criteriaFor(criteria), ...formatStatus(status) },
        using,
        input,
      });

      const projection = connectionProjection(info);
      const result = await basedb.paginate(model, {
        query,
        sort,
        projection,
        collate: shouldCollate(sort.field),
        ...pagination,
      });
      basedb.log('@findMany', start, { model });
      return result;
    };
  }
}

module.exports = FindManyDirective;
